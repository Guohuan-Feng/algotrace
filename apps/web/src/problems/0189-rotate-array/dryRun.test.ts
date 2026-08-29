import { describe, expect, test } from "vitest";
import { createRotateArrayDryRun } from "./dryRun";

describe("Rotate Array dry run", () => {
  test("performs the three reversals for the official first example", () => {
    const { frames } = createRotateArrayDryRun([1, 2, 3, 4, 5, 6, 7], 3);

    expect(frames.some((frame) => frame.phase === "reverse-all")).toBe(true);
    expect(frames.some((frame) => frame.phase === "reverse-prefix")).toBe(true);
    expect(frames.some((frame) => frame.phase === "reverse-suffix")).toBe(true);
    expect(frames[frames.length - 1]?.result).toEqual([5, 6, 7, 1, 2, 3, 4]);
  });

  test("normalizes a rotation larger than the array length", () => {
    const { frames } = createRotateArrayDryRun([1, 2, 3], 4);

    expect(frames[frames.length - 1]?.result).toEqual([3, 1, 2]);
  });
});
