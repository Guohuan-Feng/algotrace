import { describe, expect, test } from "vitest";
import { createCombinationSumIiDryRun } from "./dryRun";

describe("Combination Sum II dry run", () => {
  test("uses each sorted candidate once and records only target-sum paths", () => {
    const { frames } = createCombinationSumIiDryRun([10, 1, 2, 7, 6, 1, 5], 8);
    const last = frames[frames.length - 1]!;

    expect(last.result).toEqual([[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]);
    expect(frames.some((frame) => frame.kind === "prune" && frame.total > 8)).toBe(true);
  });
});
