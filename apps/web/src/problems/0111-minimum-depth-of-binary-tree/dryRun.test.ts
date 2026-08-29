import { describe, expect, test } from "vitest";
import { createMinimumDepthDryRun } from "./dryRun";

describe("Minimum Depth of Binary Tree dry run", () => {
  test("returns the official first example minimum depth", () => {
    const { frames } = createMinimumDepthDryRun([3, 9, 20, null, null, 15, 7]);
    expect(frames[frames.length - 1]?.result).toBe(2);
  });

  test("does not count a missing child as a leaf path", () => {
    const { frames } = createMinimumDepthDryRun([2, null, 3, null, 4, null, 5, null, 6]);
    expect(frames[frames.length - 1]?.result).toBe(5);
  });
});
