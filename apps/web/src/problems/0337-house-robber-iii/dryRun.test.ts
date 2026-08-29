import { describe, expect, test } from "vitest";
import { createHouseRobberTreeDryRun } from "./dryRun";

describe("House Robber III dry run", () => {
  test("chooses the grandchildren in the official first example", () => {
    const { frames } = createHouseRobberTreeDryRun([3, 2, 3, null, 3, null, 1]);

    expect(frames[frames.length - 1]?.result).toBe(7);
    expect(frames.some((frame) => frame.rob === 7 && frame.skip === 6)).toBe(true);
  });

  test("skips the root when its children are more valuable", () => {
    const { frames } = createHouseRobberTreeDryRun([3, 4, 5, 1, 3, null, 1]);

    expect(frames[frames.length - 1]?.result).toBe(9);
  });
});
