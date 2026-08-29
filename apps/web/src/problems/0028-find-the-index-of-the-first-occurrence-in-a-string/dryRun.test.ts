import { describe, expect, test } from "vitest";
import { createFirstOccurrenceDryRun } from "./dryRun";

describe("Find the Index of the First Occurrence in a String dry run", () => {
  test("finds sad at index zero in LeetCode example 1", () => {
    const run = createFirstOccurrenceDryRun("sadbutsad", "sad");

    expect(run.frames[run.frames.length - 1]?.result).toBe(0);
  });

  test("returns minus one in LeetCode example 2", () => {
    const run = createFirstOccurrenceDryRun("leetcode", "leeto");

    expect(run.frames[run.frames.length - 1]?.result).toBe(-1);
  });
});
