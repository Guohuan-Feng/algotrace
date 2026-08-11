import { describe, expect, test } from "vitest";
import { createOpenLockDryRun } from "./dryRun";

describe("Open the Lock dry run", () => {
  test("enqueues wheel neighbors and reaches the official target in six moves", () => {
    const { frames } = createOpenLockDryRun(["0201", "0101", "0102", "1212", "2002"], "0202");
    const finalFrame = frames[frames.length - 1];

    expect(frames.some((frame) => frame.queuedLock === "0001")).toBe(true);
    expect(finalFrame.result).toBe(6);
  });
});
