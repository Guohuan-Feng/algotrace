import { describe, expect, test } from "vitest";
import { createKSmallestPairsDryRun } from "./dryRun";

describe("Find K Pairs with Smallest Sums dry run", () => {
  test("emits the official first three pairs in heap order", () => {
    const { frames } = createKSmallestPairsDryRun([1, 7, 11], [2, 4, 6], 3);

    expect(frames[frames.length - 1]?.result).toEqual([[1, 2], [1, 4], [1, 6]]);
    expect(frames.some((frame) => frame.phase === "push-next")).toBe(true);
  });

  test("stops after k pairs for the second official example", () => {
    const { frames } = createKSmallestPairsDryRun([1, 1, 2], [1, 2, 3], 2);

    expect(frames[frames.length - 1]?.result).toEqual([[1, 1], [1, 1]]);
  });
});
