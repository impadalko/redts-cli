class MockConnection implements Deno.Conn {
  localAddr: Deno.Addr = { transport: "unix", path: "" };
  remoteAddr: Deno.Addr = { transport: "unix", path: "" };
  rid = 0;
  readable = new ReadableStream();
  writable = new WritableStream();

  readCounter = 0;
  readValue: number[][] = [];
  readBytes: number[] | null = null;

  constructor(
    parameters: {
      remoteAddr?: Deno.Addr;
      readValue?: number[][];
      readBytes?: number[];
    },
  ) {
    const { remoteAddr, readValue, readBytes } = parameters;
    if (remoteAddr) this.remoteAddr = remoteAddr;
    if (readValue) this.readValue = readValue;
    if (readBytes) this.readBytes = readBytes;
  }

  async closeWrite(): Promise<void> {}

  ref(): void {}

  unref(): void {}

  read(buffer: Uint8Array): Promise<number | null> {
    if (!this.readBytes) return Promise.resolve(this.readBytes);
    buffer.set(this.readValue[this.readCounter]);
    return Promise.resolve(this.readBytes[this.readCounter++]);
  }

  write(): Promise<number> {
    return Promise.resolve(0);
  }

  close(): void {}
}

export default MockConnection;
