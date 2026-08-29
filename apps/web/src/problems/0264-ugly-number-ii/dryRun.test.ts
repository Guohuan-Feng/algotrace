import { describe, expect, test } from "vitest";
import { createUglyNumberIiDryRun } from "./dryRun";

describe("Ugly Number II dry run", () => {
  test("generates the official tenth ugly number with three DP pointers", () => {
    const { frames } = createUglyNumberIiDryRun(10);

    expect(frames[frames.length - 1]?.result).toBe(12);
    expect(frames.some((frame) => frame.phase === "advance" && frame.moved.includes("i2"))).toBe(true);
  });

  test("advances tied pointers together to avoid duplicate values", () => {
    const { frames } = createUglyNumberIiDryRun(7);

    expect(frames[frames.length - 1]?.sequence).toEqual([1, 2, 3, 4, 5, 6, 8]);
  });
});
