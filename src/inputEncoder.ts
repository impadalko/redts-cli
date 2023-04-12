class InputEncoder {
  textEncoder: TextEncoder;

  constructor() {
    this.textEncoder = new TextEncoder();
  }

  encode(input: string): Uint8Array[] {
    if (!input) {
      return [this.textEncoder.encode(`*0\r\n`)];
    }

    const output: Uint8Array[] = [];
    const tokens = input.split(" ");
    output.push(this.textEncoder.encode(`*${tokens.length}\r\n`));
    for (const el of tokens) {
      output.push(this.textEncoder.encode(`$${el.length}\r\n`));
      output.push(this.textEncoder.encode(`${el}\r\n`));
    }
    return output;
  }
}

export default InputEncoder;
