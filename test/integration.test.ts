import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.182.0/testing/asserts.ts";
import {
  afterEach,
  beforeEach,
  describe,
  it,
} from "https://deno.land/std@0.182.0/testing/bdd.ts";
import {
  returnsNext,
  Stub,
  stub,
} from "https://deno.land/std@0.186.0/testing/mock.ts";

import { main } from "src/cli.ts";

describe("Integration test", () => {
  let promptStub: Stub;
  let consoleStub: Stub;

  beforeEach(() => {
    consoleStub = stub(console, "log");
  });

  afterEach(() => {
    promptStub.restore();
    consoleStub.restore();
  });

  it("should print correctly when the response is a simple string", async () => {
    promptStub = stub(window, "prompt", returnsNext(["ping", "exit"]));

    await main();
    assertEquals(consoleStub.calls[0].args[0], "PONG");
  });

  it("should print correctly when the response is an integer", async () => {
    promptStub = stub(
      window,
      "prompt",
      returnsNext(["del int", "incr int", "exit"]),
    );

    await main();
    assertEquals(consoleStub.calls[1].args[0], "(integer) 1");
  });

  it("should print correctly when the response is an error", async () => {
    promptStub = stub(window, "prompt", returnsNext(["helloworld", "exit"]));

    await main();

    assertStringIncludes(
      consoleStub.calls[0].args[0],
      "(error) ERR unknown command 'helloworld'",
    );
  });

  it("should print correctly when the response is a bulk string", async () => {
    promptStub = stub(
      window,
      "prompt",
      returnsNext(["set key abc", "get key", "exit"]),
    );

    await main();
    assertEquals(consoleStub.calls[1].args[0], "abc");
  });

  it("should print correctly when the response is a list", async () => {
    promptStub = stub(
      window,
      "prompt",
      returnsNext(["del map", "hset map a 1", "hgetall map", "exit"]),
    );

    await main();
    assertEquals(consoleStub.calls[2].args[0], "1) a\n2) 1");
  });
});
