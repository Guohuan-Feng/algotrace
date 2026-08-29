import { describe, expect, test } from "vitest";
import { createLcaDeepestLeavesDryRun } from "./dryRun";

describe("Lowest Common Ancestor of Deepest Leaves dry run", () => {
  test("returns the split point that covers both deepest leaves", () => {
    const { frames } = createLcaDeepestLeavesDryRun([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);

    expect(frames[frames.length - 1]?.result).toBe(2);
    expect(frames.some((frame) => frame.phase === "lca" && frame.lcaValue === 2)).toBe(true);
  });
});
