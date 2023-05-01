import Uint8ArrayUtil from "./uint8ArrayUtil.ts";

type ParsedOutput = (string | ParsedOutput)[];

class OutputDecoder {
  textDecoder: TextDecoder;
  uint8ArrayUtil: Uint8ArrayUtil;
  separator = new Uint8Array([13, 10]); // \r\n

  constructor() {
    this.textDecoder = new TextDecoder();
    this.uint8ArrayUtil = new Uint8ArrayUtil();
  }

  decode(input: Uint8Array[]): string {
    const mergedInput = this.uint8ArrayUtil.merge(input);
    const trimmedInput = this.uint8ArrayUtil.trim(mergedInput);
    const tokens = this.uint8ArrayUtil.split(trimmedInput, this.separator);

    const [parsed, _] = this.#parse(tokens);
    return this.#format(parsed);
  }

  #parse(
    tokens: Uint8Array[],
    offset = 0,
    max = Infinity,
  ): [ParsedOutput, number] {
    const output: ParsedOutput = [];
    let i = offset;
    let parsed = 0;
    while (i < tokens.length && parsed < max) {
      const [dataTypeChar, ...payload] = tokens[i];
      switch (dataTypeChar) {
        case 58: { // :, integer
          output.push(`(integer) ${this.#decodePayload(payload)}`);
          i++;
          break;
        }
        case 45: { // -, error
          output.push(`(error) ${this.#decodePayload(payload)}`);
          i++;
          break;
        }
        case 42: { // *, array
          const arraySize = Number(this.#decodePayload(payload));
          if (arraySize === -1) {
            output.push("(nil)");
            i++;
          } else if (arraySize === 0) {
            output.push("(empty array)");
            i++;
          } else {
            const [array, nextIndex] = this.#parse(tokens, ++i, arraySize);
            output.push(array);
            i = nextIndex;
          }
          break;
        }
        case 36: { // $, bulk string
          const listSize = Number(this.#decodePayload(payload));
          let s = tokens[++i];
          // This is to cover the edge case where \r\n is part of the string.
          while (s.length < listSize) {
            s = this.uint8ArrayUtil.merge([s, this.separator, tokens[++i]]);
          }
          output.push(this.textDecoder.decode(s));
          i++;
          break;
        }
        case 43: // +, simple string
        default: { // All known cases are covered, default only for undocumented behavior
          output.push(this.#decodePayload(payload));
          i++;
          break;
        }
      }
      parsed++;
    }
    return [output, i];
  }

  #decodePayload(payload: number[]): string {
    return this.textDecoder.decode(new Uint8Array(payload));
  }

  #format(parsed: ParsedOutput, depth = 0): string {
    // At the top level of the data structure, an array is not a true array but actually multiple
    // returned values when commands are pipelined.
    if (depth === 0) {
      return parsed.reduce((acc: string[], token) => {
        if (typeof token === "string") return acc.concat(token);
        return acc.concat(this.#format(token, depth + 1));
      }, []).join("\n\n");
    }

    const indent = "  ".repeat(depth - 1);
    return parsed.reduce((acc: string[], token, index) => {
      if (typeof token === "string") {
        return acc.concat([`${indent}${index + 1}) ${token}`]);
      }
      return acc.concat(
        `${indent}${index + 1})`,
        this.#format(token, depth + 1),
      );
    }, []).join("\n");
  }
}

export default OutputDecoder;
