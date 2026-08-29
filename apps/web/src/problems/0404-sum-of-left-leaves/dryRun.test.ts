import { describe, expect, test } from "vitest";
import { createSumOfLeftLeavesDryRun } from "./dryRun";

describe("Sum of Left Leaves dry run", () => {
  test("adds the official left leaves 9 and 15", () => {
    const { frames } = createSumOfLeftLeavesDryRun([3, 9, 20, null, null, 15, 7]);

    expect(frames[frames.length - 1]?.result).toBe(24);
    expect(frames.some((frame) => frame.sum === 24)).toBe(true);
  });

  test("does not count a right-only leaf as a left leaf", () => {
    const { frames } = createSumOfLeftLeavesDryRun([1, null, 2]);
    expect(frames[frames.length - 1]?.result).toBe(0);
  });
});
