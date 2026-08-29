import { describe, expect, test } from "vitest";
import { createMergeTreesDryRun } from "./dryRun";

describe("Merge Two Binary Trees dry run", () => {
  test("adds overlapping nodes and preserves a one-sided child", () => {
    const { frames } = createMergeTreesDryRun([1, 3, 2, 5], [2, 1, 3, null, 4, null, 7]);

    expect(frames[frames.length - 1]?.result).toEqual([3, 4, 5, 5, 4, null, 7]);
    expect(frames.some((frame) => frame.phase === "merge" && frame.mergedValue === 3)).toBe(true);
    expect(frames.some((frame) => frame.phase === "keep")).toBe(true);
  });
});
