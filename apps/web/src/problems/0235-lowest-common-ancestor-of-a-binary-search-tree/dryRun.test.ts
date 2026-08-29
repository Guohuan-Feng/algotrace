import { describe, expect, test } from "vitest";
import { createLcaBstDryRun } from "./dryRun";

describe("LCA of a BST dry run", () => {
  test("returns the split point for the first official example", () => {
    const { frames } = createLcaBstDryRun([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8);

    expect(frames[frames.length - 1]?.result).toBe(6);
    expect(frames.some((frame) => frame.phase === "found")).toBe(true);
  });

  test("walks left when both nodes are lower than the current BST node", () => {
    const { frames } = createLcaBstDryRun([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4);

    expect(frames[frames.length - 1]?.result).toBe(2);
    expect(frames.some((frame) => frame.phase === "left")).toBe(true);
  });
});
