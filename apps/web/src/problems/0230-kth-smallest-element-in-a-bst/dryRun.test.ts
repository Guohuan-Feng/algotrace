import { describe, expect, test } from "vitest";
import { createKthSmallestBstDryRun } from "./dryRun";

describe("Kth Smallest Element in a BST dry run", () => {
  test("visits the official BST in sorted inorder order and stops at k", () => {
    const { frames } = createKthSmallestBstDryRun([3, 1, 4, null, 2], 1);
    const done = frames[frames.length - 1];

    expect(done?.result).toBe(1);
    expect(done?.visitedValues).toEqual([1]);
  });

  test("counts each popped node toward a later k", () => {
    const { frames } = createKthSmallestBstDryRun([5, 3, 6, 2, 4, null, null, 1], 3);

    expect(frames[frames.length - 1]?.result).toBe(3);
  });
});
