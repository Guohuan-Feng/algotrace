import { describe, expect, test } from "vitest";
import { createKthLargestStreamDryRun } from "./dryRun";

describe("Kth Largest Element in a Stream dry run", () => {
  test("heapifies the seed values and reports the kth largest after each add", () => {
    const { frames } = createKthLargestStreamDryRun(3, [4, 5, 8, 2], [3, 5, 10, 9, 4]);
    const last = frames[frames.length - 1]!;

    expect(last.answers).toEqual([4, 5, 5, 8, 8]);
    expect(last.heap).toEqual([8, 9, 10]);
    expect(frames.some((frame) => frame.phase === "trim")).toBe(true);
  });
});
