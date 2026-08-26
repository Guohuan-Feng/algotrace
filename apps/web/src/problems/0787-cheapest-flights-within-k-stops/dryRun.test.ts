import { describe, expect, test } from "vitest";
import { createCheapestFlightsDryRun } from "./dryRun";

describe("Cheapest Flights Within K Stops dry run", () => {
  const flights = [
    [0, 1, 100],
    [1, 2, 100],
    [2, 0, 100],
    [1, 3, 600],
    [2, 3, 200],
  ];

  test("returns 700 when only one stop is allowed", () => {
    const { frames } = createCheapestFlightsDryRun(4, flights, 0, 3, 1);

    expect(frames[frames.length - 1]?.result).toBe(700);
  });

  test("returns 400 when two stops allow the cheaper route", () => {
    const { frames } = createCheapestFlightsDryRun(4, flights, 0, 3, 2);

    expect(frames[frames.length - 1]?.result).toBe(400);
  });

  test("reads from dist instead of newly updated temp within the same round", () => {
    const { frames } = createCheapestFlightsDryRun(3, [[0, 1, 100], [1, 2, 100]], 0, 2, 0);

    expect(frames[frames.length - 1]?.result).toBe(-1);
    expect(frames.some((frame) => frame.phase === "skip" && frame.flight?.[0] === 1)).toBe(true);
  });
});
