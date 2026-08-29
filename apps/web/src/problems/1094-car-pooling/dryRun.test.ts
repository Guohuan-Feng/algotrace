import { describe, expect, test } from "vitest";
import { createCarPoolingDryRun } from "./dryRun";

describe("Car Pooling dry run", () => {
  test("applies pickup and drop-off deltas before detecting an over-capacity station", () => {
    const { frames } = createCarPoolingDryRun([[2, 1, 5], [3, 3, 7]], 4);
    const last = frames[frames.length - 1]!;

    expect(last.result).toBe(false);
    expect(frames.some((frame) => frame.current === 3 && frame.passengers === 5)).toBe(true);
  });
});
