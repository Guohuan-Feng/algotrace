import { describe, expect, test } from "vitest";
import { createRangeSumQuery2dDryRun } from "./dryRun";

const matrix = [
  [3, 0, 1, 4, 2],
  [5, 6, 3, 2, 1],
  [1, 2, 0, 1, 5],
  [4, 1, 0, 1, 7],
  [1, 0, 3, 0, 5],
];

describe("Range Sum Query 2D dry run", () => {
  test("builds the prefix table then uses inclusion-exclusion for the official query", () => {
    const { frames } = createRangeSumQuery2dDryRun(matrix, 2, 1, 4, 3);

    expect(frames.some((frame) => frame.phase === "build")).toBe(true);
    expect(frames[frames.length - 1]?.result).toBe(8);
  });

  test("answers another official query from the same prefix table", () => {
    const { frames } = createRangeSumQuery2dDryRun(matrix, 1, 1, 2, 2);

    expect(frames[frames.length - 1]?.result).toBe(11);
  });
});
