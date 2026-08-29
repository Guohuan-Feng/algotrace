import { describe, expect, test } from "vitest";
import { createMergeKListsDryRun } from "./dryRun";

describe("Merge k Sorted Lists dry run", () => {
  test("uses the min-heap to merge the official first example", () => {
    const { frames } = createMergeKListsDryRun([[1, 4, 5], [1, 3, 4], [2, 6]]);
    const done = frames[frames.length - 1];

    expect(done?.result).toEqual([1, 1, 2, 3, 4, 4, 5, 6]);
    expect(done?.heap).toEqual([]);
  });

  test("returns an empty list when every input list is empty", () => {
    const { frames } = createMergeKListsDryRun([[], []]);

    expect(frames[frames.length - 1]?.result).toEqual([]);
  });
});
