import * as Uint8ArrayUtil from "./uint8ArrayUtil.ts";
import { format } from "./format.ts";
import { ParsedOutput } from "./types.ts";

class OutputDecoder {
  textDecoder: TextDecoder;
  separator = new Uint8Array([13, 10]); // \r\n

  constructor() {
    this.textDecoder = new TextDecoder();
  }

  decode(input: Uint8Array[]): string {
    const mergedInput = Uint8ArrayUtil.merge(input);
    const trimmedInput = Uint8ArrayUtil.trim(mergedInput);
    const tokens = Uint8ArrayUtil.split(trimmedInput, this.separator);

    const [parsed, _] = this.#parse(tokens);
    return format(parsed);
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
      let parsedPayload: ParsedOutput | string;
      let nextIndex: number;
      switch (dataTypeChar) {
        case 58: { // :, integer
          [parsedPayload, nextIndex] = this.#parseInteger(payload, i);
          break;
        }
        case 45: { // -, error
          [parsedPayload, nextIndex] = this.#parseError(payload, i);
          break;
        }
        case 42: { // *, array
          [parsedPayload, nextIndex] = this.#parseArray(payload, tokens, i);
          break;
        }
        case 36: { // $, bulk string
          [parsedPayload, nextIndex] = this.#parseBulkString(
            payload,
            tokens,
            i,
          );
          break;
        }
        case 43: // +, simple string
        default: { // All known cases are covered, default only for undocumented behavior
          [parsedPayload, nextIndex] = this.#parseString(payload, i);
          break;
        }
      }
      output.push(parsedPayload);
      i = nextIndex;
      parsed++;
    }
    return [output, i];
  }

  #parseInteger(payload: number[], index: number): [string, number] {
    return [`(integer) ${this.#decodePayload(payload)}`, index + 1];
  }

  #parseError(payload: number[], index: number): [string, number] {
    return [`(error) ${this.#decodePayload(payload)}`, index + 1];
  }

  #parseArray(
    payload: number[],
    tokens: Uint8Array[],
    index: number,
  ): [ParsedOutput | string, number] {
    const arraySize = Number(this.#decodePayload(payload));
    if (arraySize === -1) {
      return ["(nil)", index + 1];
    }

    if (arraySize === 0) {
      return ["(empty array)", index + 1];
    }

    return this.#parse(tokens, ++index, arraySize);
  }

  #parseBulkString(
    payload: number[],
    tokens: Uint8Array[],
    index: number,
  ): [string, number] {
    const stringSize = Number(this.#decodePayload(payload));
    if (stringSize === -1) {
      return ["(nil)", index + 1];
    }

    let s = tokens[++index];
    // This is to cover the edge case where \r\n is part of the string.
    while (s.length < stringSize) {
      s = Uint8ArrayUtil.merge([s, this.separator, tokens[++index]]);
    }
    return [this.textDecoder.decode(s), index + 1];
  }

  #parseString(payload: number[], index: number): [string, number] {
    return [this.#decodePayload(payload), index + 1];
  }

  #decodePayload(payload: number[]): string {
    return this.textDecoder.decode(new Uint8Array(payload));
  }
}

export default OutputDecoder;
