import { describe, expect, test } from "vitest";
import { createSearchInsertDryRun } from "./dryRun";

describe("Search Insert Position dry run", () => {
  test("returns the matching index in LeetCode example 1", () => {
    const run = createSearchInsertDryRun([1, 3, 5, 6], 5);

    expect(run.frames[run.frames.length - 1]?.result).toBe(2);
  });

  test("returns the first greater element index in LeetCode example 2", () => {
    const run = createSearchInsertDryRun([1, 3, 5, 6], 2);

    expect(run.frames[run.frames.length - 1]?.result).toBe(1);
  });
});
