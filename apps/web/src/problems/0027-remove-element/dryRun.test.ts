import { describe, expect, test } from "vitest";
import { createRemoveElementDryRun } from "./dryRun";

describe("Remove Element dry run", () => {
  test("keeps the two non-three values in LeetCode example 1", () => {
    const run = createRemoveElementDryRun([3, 2, 2, 3], 3);

    expect(run.frames[run.frames.length - 1]?.result).toEqual({ k: 2, nums: [2, 2] });
  });

  test("preserves every non-target value in LeetCode example 2", () => {
    const run = createRemoveElementDryRun([0, 1, 2, 2, 3, 0, 4, 2], 2);

    expect(run.frames[run.frames.length - 1]?.result).toEqual({ k: 5, nums: [0, 1, 3, 0, 4] });
  });
});
