import { describe, expect, test } from "vitest";
import { createBinaryTreePathsDryRun } from "./dryRun";

describe("Binary Tree Paths dry run", () => {
  test("records each root-to-leaf path in the official example", () => {
    const { frames } = createBinaryTreePathsDryRun([1, 2, 3, null, 5]);

    expect(frames[frames.length - 1]?.result).toEqual(["1->2->5", "1->3"]);
    expect(frames.some((frame) => frame.phase === "record")).toBe(true);
  });

  test("returns one path for a single-node tree", () => {
    const { frames } = createBinaryTreePathsDryRun([1]);

    expect(frames[frames.length - 1]?.result).toEqual(["1"]);
  });
});
