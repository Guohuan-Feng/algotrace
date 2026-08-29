import { describe, expect, test } from "vitest";
import { createSymmetricTreeDryRun } from "./dryRun";

describe("Symmetric Tree dry run", () => {
  test("accepts the official symmetric example", () => {
    const { frames } = createSymmetricTreeDryRun([1, 2, 2, 3, 4, 4, 3]);
    expect(frames[frames.length - 1]?.result).toBe(true);
  });

  test("rejects the official non-symmetric example", () => {
    const { frames } = createSymmetricTreeDryRun([1, 2, 2, null, 3, null, 3]);
    expect(frames[frames.length - 1]?.result).toBe(false);
    expect(frames.some((frame) => frame.phase === "mismatch")).toBe(true);
  });
});
