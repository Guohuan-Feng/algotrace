import { describe, expect, test } from "vitest";
import { createTrappingRainWaterDryRun } from "./dryRun";

describe("Trapping Rain Water dry run", () => {
  test("collects six units in LeetCode example 1", () => {
    const { frames } = createTrappingRainWaterDryRun([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]);
    const final = frames[frames.length - 1];

    expect(final).toMatchObject({ result: 6, water: 6 });
  });

  test("keeps three units between the two boundary bars", () => {
    const { frames } = createTrappingRainWaterDryRun([4, 2, 0, 3, 2, 5]);

    expect(frames[frames.length - 1]?.result).toBe(9);
  });
});
