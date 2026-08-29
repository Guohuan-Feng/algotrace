import { describe, expect, test } from "vitest";
import { createTribonacciDryRun } from "./dryRun";

describe("N-th Tribonacci Number dry run", () => {
  test("adds the prior three states at every index", () => {
    const { frames } = createTribonacciDryRun(4);
    const finalFrame = frames[frames.length - 1];

    expect(finalFrame?.dp).toEqual([0, 1, 1, 2, 4]);
    expect(finalFrame?.result).toBe(4);
  });
});
