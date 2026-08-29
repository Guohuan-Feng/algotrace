import { describe, expect, test } from "vitest";
import { createTwoSumSortedDryRun } from "./dryRun";

describe("Two Sum II dry run", () => {
  test("returns one-indexed pair positions for the official first example", () => {
    const { frames } = createTwoSumSortedDryRun([2, 7, 11, 15], 9);

    expect(frames[frames.length - 1]?.result).toEqual([1, 2]);
  });

  test("moves the right pointer when the pair sum is too large", () => {
    const { frames } = createTwoSumSortedDryRun([2, 3, 4, 8], 6);

    expect(frames.some((frame) => frame.phase === "move-right")).toBe(true);
    expect(frames[frames.length - 1]?.result).toEqual([1, 3]);
  });
});
