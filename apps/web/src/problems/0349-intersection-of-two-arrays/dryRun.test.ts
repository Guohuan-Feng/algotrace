import { describe, expect, test } from "vitest";
import { createIntersectionDryRun } from "./dryRun";

describe("Intersection of Two Arrays dry run", () => {
  test("keeps each common value once in the first official example", () => {
    const { frames } = createIntersectionDryRun([1, 2, 2, 1], [2, 2]);

    expect(frames[frames.length - 1]?.result).toEqual([2]);
    expect(frames.some((frame) => frame.phase === "found")).toBe(true);
  });

  test("finds both values in the second official example", () => {
    const { frames } = createIntersectionDryRun([4, 9, 5], [9, 4, 9, 8, 4]);

    expect(frames[frames.length - 1]?.result).toEqual([4, 9]);
  });
});
