import { describe, expect, test } from "vitest";
import { createFlattenTreeDryRun } from "./dryRun";

describe("Flatten Binary Tree to Linked List dry run", () => {
  test("does not mark untouched leaf nodes as flattened at the start", () => {
    const { frames } = createFlattenTreeDryRun([1, 2, 5, 3, 4, null, 6]);

    expect(frames[0]?.flattenedIds).toEqual([]);
  });

  test("rewires the official example into preorder right pointers", () => {
    const { frames } = createFlattenTreeDryRun([1, 2, 5, 3, 4, null, 6]);
    const done = frames[frames.length - 1];

    expect(done?.result).toEqual([1, 2, 3, 4, 5, 6]);
    expect(done?.links).toEqual({
      "node-0": "node-1",
      "node-1": "node-3",
      "node-3": "node-4",
      "node-4": "node-2",
      "node-2": "node-6",
      "node-6": null,
    });
  });

  test("keeps a single-node tree as a null-terminated list", () => {
    const { frames } = createFlattenTreeDryRun([0]);
    const done = frames[frames.length - 1];

    expect(done?.result).toEqual([0]);
    expect(done?.links).toEqual({ "node-0": null });
  });
});
