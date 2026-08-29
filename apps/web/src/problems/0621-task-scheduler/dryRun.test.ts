import { describe, expect, test } from "vitest";
import { createTaskSchedulerDryRun } from "./dryRun";

describe("Task Scheduler dry run", () => {
  test("runs n + 1 slots, records idle ticks, and restores unfinished frequencies", () => {
    const { frames } = createTaskSchedulerDryRun(["A", "A", "A", "B", "B", "B"], 2);
    const last = frames[frames.length - 1]!;

    expect(last.result).toBe(8);
    expect(frames.some((frame) => frame.phase === "idle")).toBe(true);
  });
});
