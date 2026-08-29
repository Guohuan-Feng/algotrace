import { describe, expect, test } from "vitest";
import { createStockSpanDryRun } from "./dryRun";

describe("Online Stock Span dry run", () => {
  test("merges spans for consecutive prices no greater than the current price", () => {
    const { frames } = createStockSpanDryRun([100, 80, 60, 70, 60, 75, 85]);
    const eightyFive = frames.find((frame) => frame.index === 6 && frame.phase === "push");

    expect(eightyFive).toMatchObject({ span: 6, stack: [[100, 1], [85, 6]] });
    expect(frames[frames.length - 1]?.result).toEqual([1, 1, 1, 2, 1, 4, 6]);
  });
});
