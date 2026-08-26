import { describe, expect, test } from "vitest";
import { createSwimInWaterDryRun } from "./dryRun";

describe("Swim in Rising Water dry run", () => {
  test("returns the minimum water level for the first official example", () => {
    const { frames } = createSwimInWaterDryRun([
      [0, 2],
      [1, 3],
    ]);

    expect(frames[frames.length - 1]?.result).toBe(3);
  });

  test("returns the minimum water level for the second official example", () => {
    const { frames } = createSwimInWaterDryRun([
      [0, 1, 2, 3, 4],
      [24, 23, 22, 21, 5],
      [12, 13, 14, 15, 16],
      [11, 17, 18, 19, 20],
      [10, 9, 8, 7, 6],
    ]);

    expect(frames[frames.length - 1]?.result).toBe(16);
  });

  test("skips an old heap entry after its cell has already been visited", () => {
    const { frames } = createSwimInWaterDryRun([
      [0, 1, 2],
      [5, 4, 3],
      [6, 7, 8],
    ]);

    expect(frames.some((frame) => frame.phase === "skip" && frame.current?.[0] === 1 && frame.current?.[1] === 1)).toBe(true);
    expect(frames[frames.length - 1]?.result).toBe(8);
  });
});
