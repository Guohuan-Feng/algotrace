import { describe, expect, test } from "vitest";
import { createPostorderTraversalDryRun } from "./dryRun";

describe("Binary Tree Postorder Traversal dry run", () => {
  test("appends the root only after both subtrees for the official first example", () => {
    const { frames } = createPostorderTraversalDryRun([1, null, 2, 3]);

    expect(frames[frames.length - 1]?.result).toEqual([3, 2, 1]);
    expect(frames.find((frame) => frame.phase === "append")?.result).toEqual([3]);
  });
});
