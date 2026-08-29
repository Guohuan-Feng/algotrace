import { describe, expect, test } from "vitest";
import { createRemoveDuplicatesListDryRun } from "./dryRun";

describe("Remove Duplicates from Sorted List dry run", () => {
  test("keeps one copy of each value in LeetCode example 1", () => {
    const { frames } = createRemoveDuplicatesListDryRun([1, 1, 2]);

    expect(frames[frames.length - 1]?.result).toEqual([1, 2]);
  });

  test("keeps the first node of each duplicate run in LeetCode example 2", () => {
    const { frames } = createRemoveDuplicatesListDryRun([1, 1, 2, 3, 3]);

    expect(frames[frames.length - 1]?.result).toEqual([1, 2, 3]);
  });
});
