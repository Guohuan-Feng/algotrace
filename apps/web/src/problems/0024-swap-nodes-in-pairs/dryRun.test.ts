import { describe, expect, test } from "vitest";
import { createSwapPairsDryRun } from "./dryRun";

describe("Swap Nodes in Pairs dry run", () => {
  test("rewires both pairs in the official first example", () => {
    const { frames } = createSwapPairsDryRun([1, 2, 3, 4]);
    const done = frames[frames.length - 1];

    expect(done?.result).toEqual([2, 1, 4, 3]);
    expect(done?.links).toEqual({ dummy: "node-1", "node-0": "node-3", "node-1": "node-0", "node-2": null, "node-3": "node-2" });
  });

  test("leaves a final unpaired node in place", () => {
    const { frames } = createSwapPairsDryRun([1, 2, 3]);

    expect(frames[frames.length - 1]?.result).toEqual([2, 1, 3]);
  });
});
