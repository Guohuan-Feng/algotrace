import { describe, expect, test } from "vitest";
import { createCoinChangeDryRun } from "./dryRun";

describe("Coin Change dry run", () => {
  test("uses the current amount as the outer loop and returns the fewest coins", () => {
    const { frames } = createCoinChangeDryRun([1, 2, 5], 11);
    const finalFrame = frames[frames.length - 1];

    expect(finalFrame?.dp).toEqual([0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3]);
    expect(finalFrame?.result).toBe(3);
  });

  test("returns minus one when the target amount remains unreachable", () => {
    const { frames } = createCoinChangeDryRun([2], 3);

    expect(frames[frames.length - 1]?.result).toBe(-1);
  });
});
