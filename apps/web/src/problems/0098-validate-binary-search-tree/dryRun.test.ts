import { describe, expect, test } from "vitest";
import { createValidateBstDryRun } from "./dryRun";

describe("Validate Binary Search Tree dry run", () => {
  test("accepts the official valid BST example", () => {
    const { frames } = createValidateBstDryRun([2, 1, 3]);

    expect(frames[frames.length - 1]?.result).toBe(true);
  });

  test("rejects the first node that violates an ancestor range", () => {
    const { frames } = createValidateBstDryRun([5, 1, 4, null, null, 3, 6]);

    expect(frames[frames.length - 1]?.result).toBe(false);
    expect(frames.some((frame) => frame.phase === "invalid" && frame.activeValue === 4)).toBe(true);
  });
});
