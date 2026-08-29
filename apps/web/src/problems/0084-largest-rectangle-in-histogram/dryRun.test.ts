import { describe, expect, test } from "vitest";
import { createLargestRectangleDryRun } from "./dryRun";

describe("Largest Rectangle in Histogram dry run", () => {
  test("calculates the 5 by 2 rectangle in LeetCode example 1", () => {
    const { frames } = createLargestRectangleDryRun([2, 1, 5, 6, 2, 3]);
    const areaTen = frames.find((frame) => frame.phase === "settle" && frame.area === 10);

    expect(areaTen).toMatchObject({ height: 5, width: 2, maxArea: 10 });
    expect(frames[frames.length - 1]?.result).toBe(10);
  });

  test("uses one bar for LeetCode example 2", () => {
    const { frames } = createLargestRectangleDryRun([2, 4]);

    expect(frames[frames.length - 1]?.result).toBe(4);
  });
});
