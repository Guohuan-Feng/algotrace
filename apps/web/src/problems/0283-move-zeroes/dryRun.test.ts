import { describe, expect, test } from "vitest";
import { createMoveZeroesDryRun } from "./dryRun";

describe("Move Zeroes dry run", () => {
  test("moves the official zeroes after all nonzero values", () => {
    const { frames } = createMoveZeroesDryRun([0, 1, 0, 3, 12]);

    expect(frames[frames.length - 1]?.result).toEqual([1, 3, 12, 0, 0]);
    expect(frames.some((frame) => frame.phase === "swap")).toBe(true);
  });

  test("leaves an already compact array unchanged", () => {
    const { frames } = createMoveZeroesDryRun([1, 2, 3]);

    expect(frames[frames.length - 1]?.result).toEqual([1, 2, 3]);
  });
});
