import { describe, expect, test } from "vitest";
import { createEvaluateDivisionDryRun } from "./dryRun";

describe("Evaluate Division dry run", () => {
  test("multiplies edge weights along each successful DFS path", () => {
    const { frames } = createEvaluateDivisionDryRun(
      [["a", "b"], ["b", "c"]],
      [2, 3],
      [["a", "c"], ["b", "a"], ["a", "e"], ["a", "a"], ["x", "x"]],
    );
    const finalFrame = frames[frames.length - 1];

    expect(finalFrame?.result).toEqual([6, 0.5, -1, 1, -1]);
  });
});
