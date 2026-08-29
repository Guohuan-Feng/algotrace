import { describe, expect, test } from "vitest";
import { createClimbingStairsDryRun } from "./dryRun";

describe("Climbing Stairs dry run", () => {
  test("starts from the submitted base cases and adds the prior two counts", () => {
    const { frames } = createClimbingStairsDryRun(5);
    const finalFrame = frames[frames.length - 1];

    expect(finalFrame?.dp).toEqual([0, 1, 2, 3, 5, 8]);
    expect(finalFrame?.result).toBe(8);
  });
});
