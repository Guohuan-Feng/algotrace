import { describe, expect, test } from "vitest";
import { createBestTimeToBuySellDryRun } from "./dryRun";

describe("Best Time to Buy and Sell Stock dry run", () => {
  test("uses the best negative purchase price before updating sell", () => {
    const { frames } = createBestTimeToBuySellDryRun([7, 1, 5, 3, 6, 4]);
    const dayFive = frames.find((frame) => frame.index === 4 && frame.phase === "sell");

    expect(dayFive).toMatchObject({ buy: -1, sell: 5, result: 5 });
    expect(frames[frames.length - 1]?.result).toBe(5);
  });
});
