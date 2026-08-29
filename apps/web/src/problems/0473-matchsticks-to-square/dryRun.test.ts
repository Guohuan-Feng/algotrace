import { describe, expect, test } from "vitest";
import { createMatchsticksToSquareDryRun } from "./dryRun";

describe("Matchsticks to Square dry run", () => {
  test("sorts sticks and fills four target-length sides", () => {
    const { frames } = createMatchsticksToSquareDryRun([1, 1, 2, 2, 2]);
    const last = frames[frames.length - 1]!;

    expect(last.result).toBe(true);
    expect(last.sides).toEqual([2, 2, 2, 2]);
  });
});
