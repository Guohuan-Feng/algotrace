import { describe, expect, test } from "vitest";
import { createNextGreaterDryRun } from "./dryRun";

describe("Next Greater Element I dry run", () => {
  test("builds the next-greater map and resolves LeetCode example 1", () => {
    const { frames } = createNextGreaterDryRun([4, 1, 2], [1, 3, 4, 2]);
    const resolve = frames.find((frame) => frame.phase === "resolve" && frame.queryIndex === 1);

    expect(resolve).toMatchObject({ query: 1, answer: 3 });
    expect(frames[frames.length - 1]?.result).toEqual([-1, 3, -1]);
  });

  test("uses the larger number to the right for LeetCode example 2", () => {
    const { frames } = createNextGreaterDryRun([2, 4], [1, 2, 3, 4]);

    expect(frames[frames.length - 1]?.result).toEqual([3, -1]);
  });
});
