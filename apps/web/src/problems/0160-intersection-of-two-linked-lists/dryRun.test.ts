import { describe, expect, test } from "vitest";
import { createIntersectionDryRun } from "./dryRun";

describe("Intersection of Two Linked Lists dry run", () => {
  test("finds the shared node after both pointers switch lists in the official first example", () => {
    const { frames } = createIntersectionDryRun([4, 1], [5, 6, 1], [8, 4, 5]);

    expect(frames[frames.length - 1]?.result).toBe(8);
    expect(frames.some((frame) => frame.phase === "switch")).toBe(true);
  });

  test("returns None when the lists have no shared suffix", () => {
    const { frames } = createIntersectionDryRun([2, 6, 4], [1, 5], []);

    expect(frames[frames.length - 1]?.result).toBeNull();
  });
});
