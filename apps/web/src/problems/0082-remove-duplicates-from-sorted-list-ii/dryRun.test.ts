import { describe, expect, test } from "vitest";
import { createRemoveDuplicatesListIiDryRun } from "./dryRun";

describe("Remove Duplicates from Sorted List II dry run", () => {
  test("removes both duplicate runs from LeetCode example 1", () => {
    const { frames } = createRemoveDuplicatesListIiDryRun([1, 2, 3, 3, 4, 4, 5]);

    expect(frames[frames.length - 1]?.result).toEqual([1, 2, 5]);
  });

  test("removes a duplicate prefix in LeetCode example 2", () => {
    const { frames } = createRemoveDuplicatesListIiDryRun([1, 1, 1, 2, 3]);

    expect(frames[frames.length - 1]?.result).toEqual([2, 3]);
  });
});
