import { describe, expect, test } from "vitest";
import { createShipCapacityDryRun } from "./dryRun";

describe("Capacity To Ship Packages dry run", () => {
  test("finds the smallest capacity that ships all weights within the day limit", () => {
    const { frames } = createShipCapacityDryRun([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);
    const last = frames[frames.length - 1]!;

    expect(last.result).toBe(15);
    expect(last.left).toBe(15);
    expect(last.right).toBe(14);
    expect(frames.some((frame) => frame.phase === "infeasible")).toBe(true);
  });
});
