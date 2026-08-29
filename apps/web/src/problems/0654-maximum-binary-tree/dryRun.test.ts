import { describe, expect, test } from "vitest";
import { createMaximumBinaryTreeDryRun } from "./dryRun";

describe("Maximum Binary Tree dry run", () => {
  test("chooses a range maximum then recurses into both remaining ranges", () => {
    const { frames } = createMaximumBinaryTreeDryRun([3, 2, 1, 6, 0, 5]);

    expect(frames[frames.length - 1]?.result).toEqual([6, 3, 5, null, 2, 0, null, null, 1]);
    expect(frames.some((frame) => frame.phase === "choose" && frame.chosenValue === 6)).toBe(true);
  });
});
