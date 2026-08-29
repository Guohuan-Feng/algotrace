import { describe, expect, test } from "vitest";
import { createKokoDryRun } from "./dryRun";

describe("Koko Eating Bananas dry run", () => {
  test("finds the smallest feasible speed and preserves the final binary-search boundary", () => {
    const { frames } = createKokoDryRun([3, 6, 7, 11], 8);
    const last = frames[frames.length - 1]!;

    expect(last.result).toBe(4);
    expect(last.left).toBe(4);
    expect(last.right).toBe(3);
    expect(frames.some((frame) => frame.phase === "feasible")).toBe(true);
  });
});
