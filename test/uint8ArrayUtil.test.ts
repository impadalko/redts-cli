import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { describe, it } from "https://deno.land/std@0.182.0/testing/bdd.ts";

import * as Uint8ArrayUtil from "src/uint8ArrayUtil.ts";

describe("Uint8Array Util", () => {
  it("should merge an empty array as an empty Uint8Array", () => {
    const merged = Uint8ArrayUtil.merge([]);

    assertEquals(merged, new Uint8Array([]));
  });

  it("should merge an array with one element as an Uint8Array with this element", () => {
    const merged = Uint8ArrayUtil.merge([new Uint8Array([1, 2, 3])]);

    assertEquals(merged, new Uint8Array([1, 2, 3]));
  });

  it("should merge an array with two elements as an Uint8Array with the merge of the elements", () => {
    const merged = Uint8ArrayUtil.merge([
      new Uint8Array([1, 2, 3]),
      new Uint8Array([4, 5]),
    ]);

    assertEquals(merged, new Uint8Array([1, 2, 3, 4, 5]));
  });

  it("should split an empty Uint8Array into an empty array", () => {
    const split = Uint8ArrayUtil.split(new Uint8Array([]), new Uint8Array([1]));

    assertEquals(split, []);
  });

  it("should not split an Uint8Array when the separator is empty", () => {
    const split = Uint8ArrayUtil.split(
      new Uint8Array([1, 2, 3]),
      new Uint8Array([]),
    );

    assertEquals(split, [new Uint8Array([1, 2, 3])]);
  });

  it("should split an Uint8Array according to the separator", () => {
    const split = Uint8ArrayUtil.split(
      new Uint8Array([1, 2, 4, 2, 3, 4, 5]),
      new Uint8Array([2, 3]),
    );

    assertEquals(split, [new Uint8Array([1, 2, 4]), new Uint8Array([4, 5])]);
  });

  it("should split an Uint8Array properly when the separator is at the end", () => {
    const split = Uint8ArrayUtil.split(
      new Uint8Array([1, 2, 4, 2, 3, 4, 5, 2, 3]),
      new Uint8Array([2, 3]),
    );

    assertEquals(split, [new Uint8Array([1, 2, 4]), new Uint8Array([4, 5])]);
  });

  it("should not trim when the Uint8Array is empty", () => {
    const trimmed = Uint8ArrayUtil.trim(new Uint8Array([]));

    assertEquals(trimmed, new Uint8Array([]));
  });

  it("should not trim when the Uint8Array does not have zeroes at the end", () => {
    const trimmed = Uint8ArrayUtil.trim(new Uint8Array([1, 1, 0, 1]));

    assertEquals(trimmed, new Uint8Array([1, 1, 0, 1]));
  });

  it("should trim when the Uint8Array has zeroes at the end", () => {
    const trimmed = Uint8ArrayUtil.trim(
      new Uint8Array([1, 1, 0, 1, 0, 0, 0, 0]),
    );

    assertEquals(trimmed, new Uint8Array([1, 1, 0, 1]));
  });
});
