import { describe, expect, test } from "vitest";
import { createContainsDuplicateIiDryRun } from "./dryRun";

describe("Contains Duplicate II dry run", () => {
  test("finds the official duplicate whose indices are within k", () => {
    const { frames } = createContainsDuplicateIiDryRun([1, 2, 3, 1], 3);

    expect(frames[frames.length - 1]?.result).toBe(true);
    expect(frames.some((frame) => frame.phase === "found")).toBe(true);
  });

  test("rejects a repeated value outside k", () => {
    const { frames } = createContainsDuplicateIiDryRun([1, 2, 3, 1, 2, 3], 2);

    expect(frames[frames.length - 1]?.result).toBe(false);
  });
});
