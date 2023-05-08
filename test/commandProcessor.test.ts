import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { describe, it } from "https://deno.land/std@0.182.0/testing/bdd.ts";
import {
  assertSpyCalls,
  spy,
} from "https://deno.land/std@0.186.0/testing/mock.ts";

import CommandProcessor from "src/commandProcessor.ts";
import MockConnection from "./mocks/connection.ts";

describe("Command Processor", () => {
  const textEncoder = new TextEncoder();

  it("should return a string when the response is in a single chunk", async () => {
    const response = textEncoder.encode("+a\r\n");
    const connection = new MockConnection({
      readValue: [Array.from(response)],
      readBytes: [response.length],
    });
    const commandProcessor = new CommandProcessor(connection);
    const encoderSpy = spy(commandProcessor.inputEncoder, "encode");
    const writeSpy = spy(connection, "write");

    const output = await commandProcessor.process("input");

    assertSpyCalls(encoderSpy, 1);
    assertSpyCalls(writeSpy, encoderSpy.calls[0].returned!.length);

    assertEquals(output, "a");
  });

  it("should return a string when the response is in multiple chunks", async () => {
    const firstChunk = textEncoder.encode("+abc");
    const secondChunk = textEncoder.encode("d\r\n");

    const connection = new MockConnection({
      readValue: [Array.from(firstChunk), Array.from(secondChunk)],
      readBytes: [firstChunk.length, secondChunk.length],
    });
    const commandProcessor = new CommandProcessor(
      connection,
      firstChunk.length,
    );
    const encoderSpy = spy(commandProcessor.inputEncoder, "encode");
    const writeSpy = spy(connection, "write");

    const output = await commandProcessor.process("");

    assertSpyCalls(encoderSpy, 1);
    assertSpyCalls(writeSpy, encoderSpy.calls[0].returned!.length);

    assertEquals(output, "abcd");
  });

  it("should return an empty string when the response is empty", async () => {
    const connection = new MockConnection({});
    const commandProcessor = new CommandProcessor(connection);
    const output = await commandProcessor.process("");

    assertEquals(output, "");
  });
});
