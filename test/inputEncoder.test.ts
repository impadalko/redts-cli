import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { describe, it } from "https://deno.land/std@0.182.0/testing/bdd.ts";

import InputEncoder from "src/inputEncoder.ts";

describe("Input encoder", () => {
  const inputEncoder = new InputEncoder();

  it("should return an empty array for an empty string", () => {
    const encoded = inputEncoder.encode("");

    assertEquals(encoded, [new Uint8Array([42, 48, 13, 10])]);
  });

  it("should return an array with one element for a string with one word", () => {
    const encoded = inputEncoder.encode("PING");
    assertEquals(encoded, [
      new Uint8Array([42, 49, 13, 10]),
      new Uint8Array([36, 52, 13, 10]),
      new Uint8Array([80, 73, 78, 71, 13, 10]),
    ]);
  });

  it("should return an array with two elements for a string with two words", () => {
    const encoded = inputEncoder.encode("GET key");
    assertEquals(encoded, [
      new Uint8Array([42, 50, 13, 10]),
      new Uint8Array([36, 51, 13, 10]),
      new Uint8Array([71, 69, 84, 13, 10]),
      new Uint8Array([36, 51, 13, 10]),
      new Uint8Array([107, 101, 121, 13, 10]),
    ]);
  });
});
