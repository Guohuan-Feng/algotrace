import { describe, expect, test } from "vitest";
import { createSortColorsDryRun } from "./dryRun";

describe("Sort Colors dry run", () => {
  test("partitions LeetCode example 1 into zeros ones and twos", () => {
    const { frames } = createSortColorsDryRun([2, 0, 2, 1, 1, 0]);

    expect(frames[frames.length - 1]?.result).toEqual([0, 0, 1, 1, 2, 2]);
  });

  test("moves a leading two to the final partition", () => {
    const { frames } = createSortColorsDryRun([2, 0, 1]);

    expect(frames[frames.length - 1]?.result).toEqual([0, 1, 2]);
  });
});
