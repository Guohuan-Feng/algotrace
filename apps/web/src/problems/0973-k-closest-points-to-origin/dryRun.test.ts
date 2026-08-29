import { describe, expect, test } from "vitest";
import { createKClosestDryRun } from "./dryRun";

describe("K Closest Points dry run", () => {
  test("uses a max-heap of size k and returns the remaining points", () => {
    const { frames } = createKClosestDryRun([[3, 3], [5, -1], [-2, 4]], 2);
    const last = frames[frames.length - 1]!;

    expect(last.result).toEqual([[3, 3], [-2, 4]]);
    expect(last.heap).toHaveLength(2);
    expect(frames.some((frame) => frame.phase === "pop-farthest")).toBe(true);
  });
});
