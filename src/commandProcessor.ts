import InputEncoder from "./inputEncoder.ts";
import OutputDecoder from "./outputDecoder.ts";

class CommandProcessor {
  inputEncoder: InputEncoder;
  outputDecoder: OutputDecoder;
  connection: Deno.Conn;
  bufferSize: number;

  constructor(connection: Deno.Conn, bufferSize = 1024) {
    this.inputEncoder = new InputEncoder();
    this.outputDecoder = new OutputDecoder();
    this.connection = connection;
    this.bufferSize = bufferSize;
  }

  async process(input: string): Promise<string> {
    const encoded = this.inputEncoder.encode(input);
    for (const el of encoded) {
      await this.connection.write(el);
    }

    const buffers: Uint8Array[] = [];
    let readBytes = 0;
    // Connection will get stuck when the amount of total bytes is a multiple of the buffer size.
    // This seems to be very unlikely to become an issue given that the buffer size is already very
    // large compared to usual payload.
    // TODO: allow for response of any sizes to be processed correctly.
    do {
      const buffer = new Uint8Array(this.bufferSize);
      const read = await this.connection.read(buffer);
      readBytes = read ?? 0;
      buffers.push(buffer);
    } while (readBytes == this.bufferSize);

    return this.outputDecoder.decode(buffers);
  }
}

export default CommandProcessor;
