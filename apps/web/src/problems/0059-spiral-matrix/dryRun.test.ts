import { describe, expect, test } from "vitest";
import { createSpiralMatrixDryRun } from "./dryRun";

describe("Spiral Matrix dry run", () => {
  test("visits the 3 by 3 official example clockwise", () => {
    const { frames } = createSpiralMatrixDryRun([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

    expect(frames[frames.length - 1]?.result).toEqual([1, 2, 3, 6, 9, 8, 7, 4, 5]);
  });

  test("turns inward for the 3 by 4 official example", () => {
    const { frames } = createSpiralMatrixDryRun([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]);

    expect(frames[frames.length - 1]?.result).toEqual([1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]);
  });
});
