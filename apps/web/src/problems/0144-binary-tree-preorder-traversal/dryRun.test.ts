import { describe, expect, test } from "vitest";
import { createPreorderTraversalDryRun } from "./dryRun";

describe("Binary Tree Preorder Traversal dry run", () => {
  test("appends root before either subtree for the official first example", () => {
    const { frames } = createPreorderTraversalDryRun([1, null, 2, 3]);

    expect(frames[frames.length - 1]?.result).toEqual([1, 2, 3]);
    expect(frames.find((frame) => frame.phase === "append")?.result).toEqual([1]);
  });
});
