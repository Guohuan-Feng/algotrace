import { describe, expect, test } from "vitest";
import { createAddTwoNumbersDryRun } from "./dryRun";

describe("Add Two Numbers dry run", () => {
  test("creates one result digit per position for LeetCode example 1", () => {
    const { frames } = createAddTwoNumbersDryRun([2, 4, 3], [5, 6, 4]);
    const tens = frames.find((frame) => frame.phase === "append" && frame.index === 1);

    expect(tens).toMatchObject({ digit: 0, carry: 1, result: [7, 0] });
    expect(frames[frames.length - 1]?.result).toEqual([7, 0, 8]);
  });

  test("keeps the final carry in LeetCode example 2", () => {
    const { frames } = createAddTwoNumbersDryRun([9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]);

    expect(frames[frames.length - 1]?.result).toEqual([8, 9, 9, 9, 0, 0, 0, 1]);
  });
});
