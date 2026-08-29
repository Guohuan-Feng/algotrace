import { describe, expect, test } from "vitest";
import { createDiameterDryRun } from "./dryRun";

describe("Diameter of Binary Tree dry run", () => {
  test("updates the diameter from the left and right subtree heights", () => {
    const { frames } = createDiameterDryRun([1, 2, 3, 4, 5]);
    expect(frames[frames.length - 1]?.result).toBe(3);
    expect(frames.some((frame) => frame.diameter === 3)).toBe(true);
  });
});
