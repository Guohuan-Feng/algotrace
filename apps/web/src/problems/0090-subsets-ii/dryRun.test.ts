import { describe, expect, test } from "vitest";
import { createSubsetsIiDryRun } from "./dryRun";

describe("Subsets II dry run", () => {
  test("sorts duplicates and skips the same value at one recursion depth", () => {
    const { frames } = createSubsetsIiDryRun([1, 2, 2]);
    const last = frames[frames.length - 1]!;

    expect(last.result).toEqual([[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]);
    expect(frames.some((frame) => frame.kind === "prune" && frame.skippedIndex === 2)).toBe(true);
  });
});
