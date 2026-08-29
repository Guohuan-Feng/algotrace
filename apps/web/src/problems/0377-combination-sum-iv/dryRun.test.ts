import { describe, expect, test } from "vitest";
import { createCombinationSumIvDryRun } from "./dryRun";

describe("Combination Sum IV dry run", () => {
  test("counts ordered ways exactly as the submitted outer-target loop", () => {
    const { frames } = createCombinationSumIvDryRun([1, 2, 3], 4);
    const finalFrame = frames[frames.length - 1];

    expect(finalFrame?.dp).toEqual([1, 1, 2, 4, 7]);
    expect(finalFrame?.result).toBe(7);
  });
});
