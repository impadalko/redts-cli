class InputEncoder {
  textEncoder: TextEncoder;

  constructor() {
    this.textEncoder = new TextEncoder();
  }

  encode(input: string): Uint8Array[] {
    if (!input) {
      return [this.textEncoder.encode(`*0\r\n`)];
    }

    const tokens = input.split(" ");
    let output = `*${tokens.length}\r\n`;
    for (const el of tokens) {
      const encodedLength = this.textEncoder.encode(el).length;
      output += `$${encodedLength}\r\n${el}\r\n`;
    }
    return [this.textEncoder.encode(output)];
  }
}

export default InputEncoder;
