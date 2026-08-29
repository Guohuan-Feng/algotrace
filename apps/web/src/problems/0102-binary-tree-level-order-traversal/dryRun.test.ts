import { describe, expect, test } from "vitest";
import { createLevelOrderDryRun } from "./dryRun";

describe("Binary Tree Level Order Traversal dry run", () => {
  test("groups the official first example by breadth-first level", () => {
    const { frames } = createLevelOrderDryRun([3, 9, 20, null, null, 15, 7]);
    expect(frames[frames.length - 1]?.result).toEqual([[3], [9, 20], [15, 7]]);
  });

  test("keeps the official empty tree output empty", () => {
    const { frames } = createLevelOrderDryRun([]);
    expect(frames[frames.length - 1]?.result).toEqual([]);
  });
});
