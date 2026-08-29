import { describe, expect, test } from "vitest";
import { createTopKFrequentDryRun } from "./dryRun";

describe("Top K Frequent Elements dry run", () => {
  test("builds counts and keeps the official two most frequent values", () => {
    const { frames } = createTopKFrequentDryRun([1, 1, 1, 2, 2, 3], 2);

    expect(frames[frames.length - 1]?.result).toEqual([1, 2]);
    expect(frames.some((frame) => frame.phase === "pop")).toBe(true);
  });

  test("returns the only distinct value in the second official example", () => {
    const { frames } = createTopKFrequentDryRun([1], 1);

    expect(frames[frames.length - 1]?.result).toEqual([1]);
  });
});
