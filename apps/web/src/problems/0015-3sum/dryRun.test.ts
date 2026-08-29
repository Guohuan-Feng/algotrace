import { describe, expect, test } from "vitest";
import { createThreeSumDryRun } from "./dryRun";

describe("3Sum dry run", () => {
  test("finds both unique triplets in LeetCode example 1", () => {
    const run = createThreeSumDryRun([-1, 0, 1, 2, -1, -4]);

    expect(run.frames[run.frames.length - 1]?.result).toEqual([[-1, -1, 2], [-1, 0, 1]]);
  });

  test("returns no triplet for LeetCode example 2", () => {
    const run = createThreeSumDryRun([0, 1, 1]);

    expect(run.frames[run.frames.length - 1]?.result).toEqual([]);
  });
});
