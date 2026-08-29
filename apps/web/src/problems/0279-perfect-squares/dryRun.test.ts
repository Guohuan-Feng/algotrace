import { describe, expect, test } from "vitest";
import { createPerfectSquaresDryRun } from "./dryRun";

describe("Perfect Squares dry run", () => {
  test("updates dp[12] with each usable square and returns three", () => {
    const { frames } = createPerfectSquaresDryRun(12);
    const squareFour = frames.find((frame) => frame.square === 4 && frame.i === 12 && frame.activeLines.includes(9));
    const finalFrame = frames[frames.length - 1];

    expect(squareFour?.dp[12]).toBe(3);
    expect(finalFrame?.result).toBe(3);
  });
});
