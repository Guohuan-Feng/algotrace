import { describe, expect, test } from "vitest";
import { createContainerWaterDryRun } from "./dryRun";

describe("Container With Most Water dry run", () => {
  test("finds the width-seven, height-seven container in LeetCode example 1", () => {
    const { frames } = createContainerWaterDryRun([1, 8, 6, 2, 5, 4, 8, 3, 7]);
    const best = frames.find((frame) => frame.phase === "best" && frame.area === 49);

    expect(best).toMatchObject({ left: 1, right: 8, maxArea: 49 });
    expect(frames[frames.length - 1]?.result).toBe(49);
  });

  test("uses both bars for LeetCode example 2", () => {
    const { frames } = createContainerWaterDryRun([1, 1]);

    expect(frames[frames.length - 1]?.result).toBe(1);
  });
});
