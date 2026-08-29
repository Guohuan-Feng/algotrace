import { describe, expect, test } from "vitest";
import { createFindDuplicateDryRun } from "./dryRun";

describe("Find the Duplicate Number dry run", () => {
  test("finds the official duplicate through cycle meeting and entrance phases", () => {
    const { frames } = createFindDuplicateDryRun([1, 3, 4, 2, 2]);

    expect(frames.some((frame) => frame.phase === "meet")).toBe(true);
    expect(frames[frames.length - 1]?.result).toBe(2);
  });

  test("finds a different cycle entrance", () => {
    const { frames } = createFindDuplicateDryRun([3, 1, 3, 4, 2]);

    expect(frames[frames.length - 1]?.result).toBe(3);
  });
});
