import { describe, expect, test } from "vitest";
import { createSubsetsDryRun } from "./dryRun";

describe("Subsets dry run", () => {
  test("appends every path before extending it with later values", () => {
    const { frames } = createSubsetsDryRun([1, 2, 3]);
    const last = frames[frames.length - 1]!;

    expect(last.result).toEqual([[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]);
  });
});
