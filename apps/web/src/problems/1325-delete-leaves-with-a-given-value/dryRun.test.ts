import { describe, expect, test } from "vitest";
import { createRemoveLeafNodesDryRun } from "./dryRun";

describe("Delete Leaves With a Given Value dry run", () => {
  test("removes new target leaves again after their children are pruned", () => {
    const { frames } = createRemoveLeafNodesDryRun([1, 2, 3, 2, null, 2, 4], 2);

    expect(frames[frames.length - 1]?.result).toEqual([1, null, 3, null, 4]);
    expect(frames.filter((frame) => frame.phase === "remove").map((frame) => frame.activeValue)).toEqual([2, 2, 2]);
  });
});
