import { describe, expect, test } from "vitest";
import { createRotatedSearchIiDryRun } from "./dryRun";

describe("Search in Rotated Sorted Array II dry run", () => {
  test("finds zero in LeetCode example 1", () => {
    const { frames } = createRotatedSearchIiDryRun([2, 5, 6, 0, 0, 1, 2], 0);

    expect(frames[frames.length - 1]?.result).toBe(true);
  });

  test("rejects target three in LeetCode example 2", () => {
    const { frames } = createRotatedSearchIiDryRun([2, 5, 6, 0, 0, 1, 2], 3);

    expect(frames[frames.length - 1]?.result).toBe(false);
  });
});
