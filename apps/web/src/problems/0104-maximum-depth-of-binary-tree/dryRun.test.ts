import { describe, expect, test } from "vitest";
import { createMaximumDepthDryRun } from "./dryRun";

describe("Maximum Depth of Binary Tree dry run", () => {
  test("returns the official first example depth", () => {
    const { frames } = createMaximumDepthDryRun([3, 9, 20, null, null, 15, 7]);
    expect(frames[frames.length - 1]?.result).toBe(3);
  });

  test("returns zero for the official empty tree", () => {
    const { frames } = createMaximumDepthDryRun([]);
    expect(frames[frames.length - 1]?.result).toBe(0);
  });
});
