import { describe, expect, test } from "vitest";
import { createReverseLinkedListIiDryRun } from "./dryRun";

describe("Reverse Linked List II dry run", () => {
  test("reverses the middle segment in LeetCode example 1", () => {
    const { frames } = createReverseLinkedListIiDryRun([1, 2, 3, 4, 5], 2, 4);

    expect(frames[frames.length - 1]?.result).toEqual([1, 4, 3, 2, 5]);
  });

  test("leaves a one-node interval unchanged in LeetCode example 2", () => {
    const { frames } = createReverseLinkedListIiDryRun([5], 1, 1);

    expect(frames[frames.length - 1]?.result).toEqual([5]);
  });
});
