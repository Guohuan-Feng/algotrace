import { describe, expect, test } from "vitest";
import { createPathSumDryRun } from "./dryRun";

describe("Path Sum dry run", () => {
  test("finds the official first example root-to-leaf target", () => {
    const { frames } = createPathSumDryRun([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], 22);
    expect(frames[frames.length - 1]?.result).toBe(true);
  });

  test("rejects the official third example", () => {
    const { frames } = createPathSumDryRun([1, 2, 3], 5);
    expect(frames[frames.length - 1]?.result).toBe(false);
  });
});
