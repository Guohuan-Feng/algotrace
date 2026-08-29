import { describe, expect, test } from "vitest";
import { createConnectNextPointersDryRun } from "./dryRun";

describe("Populating Next Right Pointers II dry run", () => {
  test("connects each level of the official example from left to right", () => {
    const { frames } = createConnectNextPointersDryRun([1, 2, 3, 4, 5, null, 7]);
    const done = frames[frames.length - 1];

    expect(done?.nextLinks).toEqual({
      "node-0": null,
      "node-1": "node-2",
      "node-2": null,
      "node-3": "node-4",
      "node-4": "node-6",
      "node-6": null,
    });
  });

  test("returns an empty pointer map for an empty tree", () => {
    const { frames } = createConnectNextPointersDryRun([]);

    expect(frames[frames.length - 1]?.nextLinks).toEqual({});
  });
});
