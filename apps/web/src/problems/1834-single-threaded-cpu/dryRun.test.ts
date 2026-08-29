import { describe, expect, test } from "vitest";
import { createSingleThreadedCpuDryRun } from "./dryRun";

describe("Single-Threaded CPU dry run", () => {
  test("advances idle time and selects waiting tasks by processing time then original index", () => {
    const { frames } = createSingleThreadedCpuDryRun([[1, 2], [2, 4], [3, 2], [4, 1]]);
    const last = frames[frames.length - 1]!;

    expect(last.result).toEqual([0, 2, 3, 1]);
    expect(frames.some((frame) => frame.phase === "jump-time")).toBe(true);
  });
});
