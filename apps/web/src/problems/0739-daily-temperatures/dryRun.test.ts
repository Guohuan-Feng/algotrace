import { describe, expect, test } from "vitest";
import { createDailyTemperaturesDryRun } from "./dryRun";

describe("Daily Temperatures dry run", () => {
  test("pops every colder pending day when a warmer temperature appears", () => {
    const { frames } = createDailyTemperaturesDryRun([73, 74, 75, 71, 69, 72, 76, 73]);
    const resolveSeventyOne = frames.find((frame) => frame.phase === "resolve" && frame.resolvedIndex === 3);

    expect(resolveSeventyOne).toMatchObject({ answer: [1, 1, 0, 2, 1, 0, 0, 0] });
    expect(frames[frames.length - 1]?.result).toEqual([1, 1, 4, 2, 1, 1, 0, 0]);
  });
});
