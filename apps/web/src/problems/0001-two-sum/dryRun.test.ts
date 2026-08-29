import { describe, expect, test } from "vitest";
import { createTwoSumDryRun } from "./dryRun";

describe("Two Sum dry run", () => {
  test("finds the complement that was previously stored in LeetCode example 1", () => {
    const { frames } = createTwoSumDryRun([2, 7, 11, 15], 9);
    const match = frames.find((frame) => frame.phase === "match");

    expect(match).toMatchObject({ index: 1, complement: 2, result: [0, 1] });
    expect(frames[frames.length - 1]?.result).toEqual([0, 1]);
  });

  test("finds the later complement in LeetCode example 2", () => {
    const { frames } = createTwoSumDryRun([3, 2, 4], 6);

    expect(frames[frames.length - 1]?.result).toEqual([1, 2]);
  });
});
