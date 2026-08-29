import { describe, expect, test } from "vitest";
import { createMinimumDifferenceDryRun } from "./dryRun";

describe("Minimum Absolute Difference in BST dry run", () => {
  test("compares each value with its inorder predecessor", () => {
    const { frames } = createMinimumDifferenceDryRun([4, 2, 6, 1, 3]);
    expect(frames[frames.length - 1]?.result).toBe(1);
    expect(frames.some((frame) => frame.diff === 1)).toBe(true);
  });
});
