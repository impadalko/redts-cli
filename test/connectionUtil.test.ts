import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { describe, it } from "https://deno.land/std@0.182.0/testing/bdd.ts";

import { getConnectionPrefix } from "src/connectionUtil.ts";
import MockConnection from "./mocks/connection.ts";

function getRandomString(): string {
  return (Math.random() + 1).toString(36).substr(2, 8);
}

function getRandomInt(): number {
  return Math.floor(Math.random() * 10000);
}

describe("Connection Util", () => {
  it("should return the connection path for UnixAddr", () => {
    const path = getRandomString();
    const connection = new MockConnection({
      remoteAddr: { transport: "unix", path },
    });

    const prefix = getConnectionPrefix(connection);

    assertEquals(prefix, `${path}>`);
  });

  it("should return the hostname and port for NetAddr", () => {
    const hostname = getRandomString();
    const port = getRandomInt();
    const connection = new MockConnection({
      remoteAddr: { transport: "tcp", hostname, port },
    });

    const prefix = getConnectionPrefix(connection);

    assertEquals(prefix, `${hostname}:${port}>`);
  });
});
