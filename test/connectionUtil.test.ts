import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { describe, it } from "https://deno.land/std@0.182.0/testing/bdd.ts";

import ConnectionUtil from "src/connectionUtil.ts";
import TestConn from "./testConn.ts";

function getRandomString(): string {
  return (Math.random() + 1).toString(36).substr(2, 8);
}

function getRandomInt(): number {
  return Math.floor(Math.random() * 10000);
}

describe("Connection Util", () => {
  const connectionUtil = new ConnectionUtil();

  it("should return the connection path for UnixAddr", () => {
    const path = getRandomString();
    const connection = new TestConn({ transport: "unix", path });

    const prefix = connectionUtil.getConnectionPrefix(connection);

    assertEquals(prefix, `${path}>`);
  });

  it("should return the hostname and port for NetAddr", () => {
    const hostname = getRandomString();
    const port = getRandomInt();
    const connection = new TestConn({ transport: "tcp", hostname, port });

    const prefix = connectionUtil.getConnectionPrefix(connection);

    assertEquals(prefix, `${hostname}:${port}>`);
  });
});
