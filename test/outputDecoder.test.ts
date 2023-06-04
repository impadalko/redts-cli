import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { describe, it } from "https://deno.land/std@0.182.0/testing/bdd.ts";

import OutputDecoder from "src/outputDecoder.ts";

describe("Output decoder", () => {
  const textEncoder = new TextEncoder();
  const outputDecoder = new OutputDecoder();

  it("should decode a simple string correctly", () => {
    const decoded = outputDecoder.decode([textEncoder.encode("+PONG\r\n")]);

    assertEquals(decoded, "PONG");
  });

  it("should decode an integer correctly", () => {
    const decoded = outputDecoder.decode([textEncoder.encode(":2\r\n")]);

    assertEquals(decoded, "(integer) 2");
  });

  it("should decode an error correctly", () => {
    const decoded = outputDecoder.decode([textEncoder.encode("-Error\r\n")]);

    assertEquals(decoded, "(error) Error");
  });

  it("should decode a null string correctly", () => {
    const decoded = outputDecoder.decode([
      textEncoder.encode("$-1\r\n"),
    ]);

    assertEquals(decoded, "(nil)");
  });

  it("should decode a bulk string correctly", () => {
    const decoded = outputDecoder.decode([
      textEncoder.encode("$10\r\nBulkString\r\n"),
    ]);

    assertEquals(decoded, "BulkString");
  });

  it("should decode a bulk string with the separator (\\r\\n) in it correctly", () => {
    const decoded = outputDecoder.decode([
      textEncoder.encode("$12\r\nBulk\r\nString\r\n"),
    ]);

    assertEquals(decoded, "Bulk\r\nString");
  });

  it("should decode a null array correctly", () => {
    const decoded = outputDecoder.decode([textEncoder.encode("*-1\r\n")]);

    assertEquals(decoded, "(nil)");
  });

  it("should decode an empty array correctly", () => {
    const decoded = outputDecoder.decode([textEncoder.encode("*0\r\n")]);

    assertEquals(decoded, "(empty array)");
  });

  it("should decode an array correctly", () => {
    const decoded = outputDecoder.decode([
      textEncoder.encode("*3\r\n+A\r\n:2\r\n$1\r\nC\r\n"),
    ]);

    assertEquals(decoded, "1) A\n2) (integer) 2\n3) C");
  });

  it("should decode nested arrays correctly", () => {
    const decoded = outputDecoder.decode([
      textEncoder.encode("*3\r\n+A\r\n*2\r\n+B\r\n+C\r\n+D\r\n"),
    ]);

    assertEquals(decoded, "1) A\n2)\n  1) B\n  2) C\n3) D");
  });

  it("should decode pipelined responses correctly", () => {
    const decoded = outputDecoder.decode([
      textEncoder.encode("+A\r\n*2\r\n+B\r\n+C\r\n+D\r\n"),
    ]);

    assertEquals(decoded, "A\n\n1) B\n2) C\n\nD");
  });
});
