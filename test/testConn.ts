class TestConn implements Deno.Conn {
  localAddr: Deno.Addr = { transport: "unix", path: "" };
  remoteAddr: Deno.Addr;
  rid = 0;
  readable = new ReadableStream();
  writable = new WritableStream();

  constructor(remoteAddr: Deno.Addr) {
    this.remoteAddr = remoteAddr;
  }

  async closeWrite(): Promise<void> {}

  ref(): void {}

  unref(): void {}

  read(): Promise<number | null> {
    return new Promise(() => null);
  }

  write(): Promise<number> {
    return new Promise(() => 0);
  }

  close(): void {}
}

export default TestConn;
