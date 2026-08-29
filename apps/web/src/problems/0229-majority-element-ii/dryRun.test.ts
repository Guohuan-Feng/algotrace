import { describe, expect, test } from "vitest";
import { createMajorityElementIiDryRun } from "./dryRun";

describe("Majority Element II dry run", () => {
  test("keeps both candidates during voting then verifies the official answer", () => {
    const { frames } = createMajorityElementIiDryRun([1, 2, 3, 1, 2, 1, 1]);
    const done = frames[frames.length - 1];

    expect(frames.some((frame) => frame.phase === "verify")).toBe(true);
    expect(done?.result).toEqual([1]);
  });

  test("returns both values that occur more than n divided by three times", () => {
    const { frames } = createMajorityElementIiDryRun([1, 2]);

    expect(frames[frames.length - 1]?.result).toEqual([1, 2]);
  });
});
