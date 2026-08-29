import { describe, expect, test } from "vitest";
import { createSlidingWindowMaximumDryRun } from "./dryRun";

describe("Sliding Window Maximum dry run", () => {
  test("records each LeetCode example 1 window maximum from the deque front", () => {
    const { frames } = createSlidingWindowMaximumDryRun([1, 3, -1, -3, 5, 3, 6, 7], 3);
    const fifthWindow = frames.find((frame) => frame.phase === "record" && frame.index === 4);

    expect(fifthWindow).toMatchObject({ deque: [4], result: [3, 3, 5] });
    expect(frames[frames.length - 1]?.result).toEqual([3, 3, 5, 5, 6, 7]);
  });

  test("handles the single-element LeetCode example 2", () => {
    const { frames } = createSlidingWindowMaximumDryRun([1], 1);

    expect(frames[frames.length - 1]?.result).toEqual([1]);
  });
});
