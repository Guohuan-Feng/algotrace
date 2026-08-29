import { describe, expect, test } from "vitest";
import { createSubtreeDryRun } from "./dryRun";

describe("Subtree of Another Tree dry run", () => {
  test("compares candidate roots and confirms the matching subtree", () => {
    const { frames } = createSubtreeDryRun([3, 4, 5, 1, 2], [4, 1, 2]);

    expect(frames[frames.length - 1]?.result).toBe(true);
    expect(frames.some((frame) => frame.phase === "match" && frame.activeRootValue === 4)).toBe(true);
  });
});
