import { describe, expect, test } from "vitest";
import { createSimplifyPathDryRun } from "./dryRun";

describe("Simplify Path dry run", () => {
  test("pops directory names for parent segments in LeetCode example 4", () => {
    const { frames } = createSimplifyPathDryRun("/a/./b/../../c/");
    const secondParent = frames.find((frame) => frame.phase === "parent" && frame.index === 5);

    expect(secondParent).toMatchObject({ stack: [] });
    expect(frames[frames.length - 1]?.result).toBe("/c");
  });

  test("collapses repeated separators in LeetCode example 3", () => {
    const { frames } = createSimplifyPathDryRun("/home//foo/");

    expect(frames[frames.length - 1]?.result).toBe("/home/foo");
  });
});
