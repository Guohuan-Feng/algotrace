import { describe, expect, test } from "vitest";
import { createMinCostClimbingStairsDryRun } from "./dryRun";

describe("Min Cost Climbing Stairs dry run", () => {
  test("computes each landing cost and takes the cheaper final step", () => {
    const { frames } = createMinCostClimbingStairsDryRun([10, 15, 20]);
    const finalFrame = frames[frames.length - 1];

    expect(finalFrame?.dp).toEqual([10, 15, 30]);
    expect(finalFrame?.result).toBe(15);
  });
});
