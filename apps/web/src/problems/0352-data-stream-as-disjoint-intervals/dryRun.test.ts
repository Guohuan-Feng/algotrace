import { describe, expect, test } from "vitest";
import { createSummaryRangesDryRun } from "./dryRun";

describe("Data Stream as Disjoint Intervals dry run", () => {
  test("merges the official stream into two disjoint ranges", () => {
    const { frames } = createSummaryRangesDryRun([1, 3, 7, 2, 6]);

    expect(frames[frames.length - 1]?.result).toEqual([[1, 3], [6, 7]]);
  });

  test("shows left, right, and merge branches", () => {
    const { frames } = createSummaryRangesDryRun([1, 3, 7, 2, 6]);

    expect(frames.some((frame) => frame.branch === "left")).toBe(true);
    expect(frames.some((frame) => frame.branch === "right")).toBe(true);
    expect(frames.some((frame) => frame.branch === "merge")).toBe(true);
  });
});
