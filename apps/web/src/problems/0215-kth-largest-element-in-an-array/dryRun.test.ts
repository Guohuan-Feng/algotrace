import { describe, expect, test } from "vitest";
import { createKthLargestDryRun } from "./dryRun";

describe("Kth Largest Element dry run", () => {
  test("keeps only k entries in the min-heap and returns its root", () => {
    const { frames } = createKthLargestDryRun([3, 2, 1, 5, 6, 4], 2);
    const last = frames[frames.length - 1]!;

    expect(last.result).toBe(5);
    expect(last.heap).toEqual([5, 6]);
    expect(frames.some((frame) => frame.phase === "pop-excess")).toBe(true);
  });
});
