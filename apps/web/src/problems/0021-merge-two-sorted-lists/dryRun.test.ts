import { describe, expect, test } from "vitest";
import { createMergeTwoListsDryRun } from "./dryRun";

describe("Merge Two Sorted Lists dry run", () => {
  test("merges LeetCode example 1 in ascending order", () => {
    const run = createMergeTwoListsDryRun([1, 2, 4], [1, 3, 4]);

    expect(run.frames[run.frames.length - 1]?.result).toEqual([1, 1, 2, 3, 4, 4]);
  });

  test("returns the non-empty list in LeetCode example 2", () => {
    const run = createMergeTwoListsDryRun([], [0]);

    expect(run.frames[run.frames.length - 1]?.result).toEqual([0]);
  });
});
