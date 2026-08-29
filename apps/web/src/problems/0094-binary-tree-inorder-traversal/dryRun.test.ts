import { describe, expect, test } from "vitest";
import { createInorderTraversalDryRun } from "./dryRun";

describe("Binary Tree Inorder Traversal dry run", () => {
  test("visits the official first example in left-root-right order", () => {
    const { frames } = createInorderTraversalDryRun([1, null, 2, 3]);

    expect(frames[frames.length - 1]?.result).toEqual([1, 3, 2]);
    expect(frames.some((frame) => frame.phase === "append" && frame.activeValue === 3)).toBe(true);
  });

  test("keeps the official empty tree example empty", () => {
    const { frames } = createInorderTraversalDryRun([]);

    expect(frames[frames.length - 1]?.result).toEqual([]);
  });
});
