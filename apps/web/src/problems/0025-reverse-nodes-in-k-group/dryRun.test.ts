import { describe, expect, test } from "vitest";
import { createReverseKGroupDryRun } from "./dryRun";

describe("Reverse Nodes in k-Group dry run", () => {
  test("reverses every complete pair in the official first example", () => {
    const { frames } = createReverseKGroupDryRun([1, 2, 3, 4, 5], 2);
    const done = frames[frames.length - 1];

    expect(done?.result).toEqual([2, 1, 4, 3, 5]);
    expect(done?.links).toEqual({ dummy: "node-1", "node-0": "node-3", "node-1": "node-0", "node-2": "node-4", "node-3": "node-2", "node-4": null });
  });

  test("leaves the final incomplete group unchanged", () => {
    const { frames } = createReverseKGroupDryRun([1, 2, 3, 4, 5], 3);

    expect(frames[frames.length - 1]?.result).toEqual([3, 2, 1, 4, 5]);
  });
});
