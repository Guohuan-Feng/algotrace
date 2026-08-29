import { describe, expect, test } from "vitest";
import { createReorderListDryRun } from "./dryRun";

describe("Reorder List dry run", () => {
  test("reverses the second half then interleaves it for the official first example", () => {
    const { frames } = createReorderListDryRun([1, 2, 3, 4]);
    const done = frames[frames.length - 1];

    expect(done?.result).toEqual([1, 4, 2, 3]);
    expect(frames.some((frame) => frame.phase === "reverse")).toBe(true);
    expect(frames.some((frame) => frame.phase === "merge")).toBe(true);
  });

  test("keeps the middle node in place for the official odd-length example", () => {
    const { frames } = createReorderListDryRun([1, 2, 3, 4, 5]);

    expect(frames[frames.length - 1]?.result).toEqual([1, 5, 2, 4, 3]);
  });
});
