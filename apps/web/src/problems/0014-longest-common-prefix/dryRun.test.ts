import { describe, expect, test } from "vitest";
import { createLongestCommonPrefixDryRun } from "./dryRun";

describe("Longest Common Prefix dry run", () => {
  test("shrinks flower to fl for LeetCode example 1", () => {
    const run = createLongestCommonPrefixDryRun(["flower", "flow", "flight"]);

    expect(run.frames[run.frames.length - 1]?.result).toBe("fl");
  });

  test("returns an empty prefix for LeetCode example 2", () => {
    const run = createLongestCommonPrefixDryRun(["dog", "racecar", "car"]);

    expect(run.frames[run.frames.length - 1]?.result).toBe("");
  });
});
