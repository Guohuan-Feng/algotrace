import { describe, expect, test } from "vitest";
import { createInvertBinaryTreeDryRun } from "./dryRun";

describe("Invert Binary Tree dry run", () => {
  test("swaps every left and right pointer in the official example", () => {
    const { frames } = createInvertBinaryTreeDryRun([4, 2, 7, 1, 3, 6, 9]);
    const done = frames[frames.length - 1];

    expect(done?.result).toEqual([4, 7, 2, 9, 6, 3, 1]);
    expect(done?.leftLinks).toMatchObject({ "node-0": "node-2", "node-1": "node-4" });
    expect(done?.rightLinks).toMatchObject({ "node-0": "node-1", "node-2": "node-5" });
  });

  test("keeps an empty tree empty", () => {
    const { frames } = createInvertBinaryTreeDryRun([]);

    expect(frames[frames.length - 1]?.result).toEqual([]);
  });
});
