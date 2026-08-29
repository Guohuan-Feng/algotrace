import { describe, expect, test } from "vitest";
import { createFindModeDryRun } from "./dryRun";

describe("Find Mode in Binary Search Tree dry run", () => {
  test("records the repeated inorder value as the only mode", () => {
    const { frames } = createFindModeDryRun([1, null, 2, 2]);
    expect(frames[frames.length - 1]?.result).toEqual([2]);
    expect(frames.some((frame) => frame.value === 2 && frame.count === 2)).toBe(true);
  });
});
