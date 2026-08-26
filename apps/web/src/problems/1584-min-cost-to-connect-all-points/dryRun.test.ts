import { describe, expect, test } from "vitest";
import { createMinCostConnectPointsDryRun } from "./dryRun";

describe("Min Cost to Connect All Points dry run", () => {
  test("builds the MST for the first official example", () => {
    const { frames } = createMinCostConnectPointsDryRun([
      [0, 0],
      [2, 2],
      [3, 10],
      [5, 2],
      [7, 0],
    ]);

    const finalFrame = frames[frames.length - 1];

    expect(finalFrame?.result).toBe(20);
    expect(finalFrame?.visited).toEqual([0, 1, 3, 4, 2]);
  });

  test("shows old heap candidates being skipped after their point joins the MST", () => {
    const { frames } = createMinCostConnectPointsDryRun([
      [0, 0],
      [2, 2],
      [3, 10],
      [5, 2],
      [7, 0],
    ]);

    expect(frames.some((frame) => frame.phase === "skip" && frame.current === 3)).toBe(true);
  });
});
