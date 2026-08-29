import { describe, expect, test } from "vitest";
import { createMergeSortedArrayDryRun } from "./dryRun";

describe("Merge Sorted Array dry run", () => {
  test("merges both populated arrays in LeetCode example 1", () => {
    const { frames } = createMergeSortedArrayDryRun([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3);

    expect(frames[frames.length - 1]?.result).toEqual([1, 2, 2, 3, 5, 6]);
  });

  test("copies nums2 when nums1 has no live entries", () => {
    const { frames } = createMergeSortedArrayDryRun([0], 0, [1], 1);

    expect(frames[frames.length - 1]?.result).toEqual([1]);
  });
});
