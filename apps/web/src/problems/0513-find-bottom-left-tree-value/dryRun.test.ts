import { describe, expect, test } from "vitest";
import { createBottomLeftDryRun } from "./dryRun";

describe("Find Bottom Left Tree Value dry run", () => {
  test("keeps the first node of the deepest level", () => {
    const { frames } = createBottomLeftDryRun([1, 2, 3, 4, null, 5, 6, null, null, 7]);
    expect(frames[frames.length - 1]?.result).toBe(7);
    expect(frames.some((frame) => frame.bottomLeft === 7)).toBe(true);
  });
});
