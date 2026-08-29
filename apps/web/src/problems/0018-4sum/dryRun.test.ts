import { describe, expect, test } from "vitest";
import { createFourSumDryRun } from "./dryRun";

describe("4Sum dry run", () => {
  test("finds all unique quadruplets in LeetCode example 1", () => {
    const run = createFourSumDryRun([1, 0, -1, 0, -2, 2], 0);

    expect(run.frames[run.frames.length - 1]?.result).toEqual([[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]);
  });

  test("keeps one quadruplet when all values are equal", () => {
    const run = createFourSumDryRun([2, 2, 2, 2, 2], 8);

    expect(run.frames[run.frames.length - 1]?.result).toEqual([[2, 2, 2, 2]]);
  });
});
