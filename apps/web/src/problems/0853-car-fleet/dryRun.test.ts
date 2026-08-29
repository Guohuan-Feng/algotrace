import { describe, expect, test } from "vitest";
import { createCarFleetDryRun } from "./dryRun";

describe("Car Fleet dry run", () => {
  test("merges a faster car into the fleet ahead in LeetCode example 1", () => {
    const { frames } = createCarFleetDryRun(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]);
    const merge = frames.find((frame) => frame.phase === "merge" && frame.position === 8);

    expect(merge).toMatchObject({ arrival: 1, fleetArrivals: [1] });
    expect(frames[frames.length - 1]?.result).toBe(3);
  });

  test("forms one fleet for LeetCode example 2", () => {
    const { frames } = createCarFleetDryRun(10, [3], [3]);

    expect(frames[frames.length - 1]?.result).toBe(1);
  });
});
