import { describe, expect, test } from "vitest";
import { createRemoveNthFromEndDryRun } from "./dryRun";

describe("Remove Nth Node From End of List dry run", () => {
  test("removes the second node from the end in LeetCode example 1", () => {
    const run = createRemoveNthFromEndDryRun([1, 2, 3, 4, 5], 2);

    expect(run.frames[run.frames.length - 1]?.result).toEqual([1, 2, 3, 5]);
  });

  test("removes the only node in LeetCode example 2", () => {
    const run = createRemoveNthFromEndDryRun([1], 1);

    expect(run.frames[run.frames.length - 1]?.result).toEqual([]);
  });
});
