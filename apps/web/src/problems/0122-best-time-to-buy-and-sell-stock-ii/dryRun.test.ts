import { describe, expect, test } from "vitest";
import { createBestTimeToBuySellIIRun } from "./dryRun";

describe("Best Time to Buy and Sell Stock II dry run", () => {
  test("uses the prior sell state to permit a later buy after taking profit", () => {
    const { frames } = createBestTimeToBuySellIIRun([7, 1, 5, 3, 6, 4]);
    const dayFour = frames.find((frame) => frame.index === 3 && frame.phase === "buy");

    expect(dayFour).toMatchObject({ buy: 1, sell: 4, result: 4 });
    expect(frames[frames.length - 1]?.result).toBe(7);
  });
});
