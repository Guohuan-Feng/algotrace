import { describe, expect, test } from "vitest";
import { createMaximumPathSumDryRun } from "./dryRun";

describe("Binary Tree Maximum Path Sum dry run", () => {
  test("finds the path through the root in the official first example", () => {
    const { frames } = createMaximumPathSumDryRun([1, 2, 3]);
    const done = frames[frames.length - 1];

    expect(done?.result).toBe(6);
    expect(done?.bestPathValues).toEqual([2, 1, 3]);
  });

  test("uses the best cross-subtree path in the official second example", () => {
    const { frames } = createMaximumPathSumDryRun([-10, 9, 20, null, null, 15, 7]);
    const done = frames[frames.length - 1];

    expect(done?.result).toBe(42);
    expect(done?.bestPathValues).toEqual([15, 20, 7]);
  });
});
