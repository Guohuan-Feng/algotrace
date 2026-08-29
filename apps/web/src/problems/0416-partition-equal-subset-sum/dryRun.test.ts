import { describe, expect, test } from "vitest";
import { createPartitionEqualSubsetSumDryRun } from "./dryRun";

describe("Partition Equal Subset Sum dry run", () => {
  test("walks the target backwards so each number is used once", () => {
    const { frames } = createPartitionEqualSubsetSumDryRun([1, 5, 11, 5]);
    const finalFrame = frames[frames.length - 1];

    expect(frames.some((frame) => frame.num === 11 && frame.j === 11 && frame.dp[11])).toBe(true);
    expect(finalFrame?.result).toBe(true);
  });
});
