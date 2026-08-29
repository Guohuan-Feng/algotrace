import { describe, expect, test } from "vitest";
import { createSameTreeDryRun } from "./dryRun";

describe("Same Tree dry run", () => {
  test("accepts the official matching tree example", () => {
    const { frames } = createSameTreeDryRun([1, 2, 3], [1, 2, 3]);
    expect(frames[frames.length - 1]?.result).toBe(true);
  });

  test("stops at the official mismatched value", () => {
    const { frames } = createSameTreeDryRun([1, 2], [1, null, 2]);
    expect(frames[frames.length - 1]?.result).toBe(false);
    expect(frames.some((frame) => frame.phase === "mismatch")).toBe(true);
  });
});
