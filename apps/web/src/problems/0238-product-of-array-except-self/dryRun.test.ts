import { describe, expect, test } from "vitest";
import { createProductExceptSelfDryRun } from "./dryRun";

describe("Product of Array Except Self dry run", () => {
  test("builds official output through prefix then suffix passes", () => {
    const { frames } = createProductExceptSelfDryRun([1, 2, 3, 4]);

    expect(frames.some((frame) => frame.phase === "prefix")).toBe(true);
    expect(frames.some((frame) => frame.phase === "suffix")).toBe(true);
    expect(frames[frames.length - 1]?.result).toEqual([24, 12, 8, 6]);
  });

  test("keeps zero handling correct without division", () => {
    const { frames } = createProductExceptSelfDryRun([-1, 1, 0, -3, 3]);

    expect(frames[frames.length - 1]?.result).toEqual([0, 0, 9, 0, 0]);
  });
});
