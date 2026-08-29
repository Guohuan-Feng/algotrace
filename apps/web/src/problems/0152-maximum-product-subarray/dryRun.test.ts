import { describe, expect, test } from "vitest";
import { createMaximumProductDryRun } from "./dryRun";

describe("Maximum Product Subarray dry run", () => {
  test("keeps both product extremes so a negative number can produce the maximum", () => {
    const { frames } = createMaximumProductDryRun([-2, 3, -4]);
    const finalFrame = frames[frames.length - 1];
    const negativeTurn = frames.find((frame) => frame.index === 2 && frame.phase === "result");

    expect(negativeTurn).toMatchObject({ oldMax: 3, curMax: 24, curMin: -12, result: 24 });
    expect(finalFrame?.result).toBe(24);
  });
});
