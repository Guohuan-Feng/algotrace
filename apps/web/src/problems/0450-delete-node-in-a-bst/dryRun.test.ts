import { describe, expect, test } from "vitest";
import { createDeleteNodeBstDryRun } from "./dryRun";

describe("Delete Node in a BST dry run", () => {
  test("replaces the official two-child target with its inorder successor", () => {
    const { frames } = createDeleteNodeBstDryRun([5, 3, 6, 2, 4, null, 7], 3);

    expect(frames[frames.length - 1]?.result).toEqual([5, 4, 6, 2, null, null, 7]);
    expect(frames.some((frame) => frame.phase === "successor")).toBe(true);
  });

  test("leaves the tree unchanged when the key does not exist", () => {
    const { frames } = createDeleteNodeBstDryRun([5, 3, 6, 2, 4, null, 7], 0);
    expect(frames[frames.length - 1]?.result).toEqual([5, 3, 6, 2, 4, null, 7]);
  });
});
