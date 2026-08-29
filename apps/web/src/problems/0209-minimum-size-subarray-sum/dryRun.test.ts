import { describe, expect, test } from "vitest";
import { createMinimumSizeSubarraySumDryRun } from "./dryRun";

describe("Minimum Size Subarray Sum dry run", () => {
  test("shrinks a valid window to the official shortest length", () => {
    const { frames } = createMinimumSizeSubarraySumDryRun(7, [2, 3, 1, 2, 4, 3]);

    expect(frames.some((frame) => frame.phase === "shrink")).toBe(true);
    expect(frames[frames.length - 1]?.result).toBe(2);
  });

  test("returns zero when no window reaches target", () => {
    const { frames } = createMinimumSizeSubarraySumDryRun(11, [1, 1, 1, 1, 1, 1, 1, 1]);

    expect(frames[frames.length - 1]?.result).toBe(0);
  });
});
