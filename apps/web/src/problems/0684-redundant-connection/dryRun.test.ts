import { describe, expect, test } from "vitest";
import { createRedundantConnectionDryRun } from "./dryRun";

describe("Redundant Connection dry run", () => {
  test("returns the first redundant edge from official example one", () => {
    const { frames } = createRedundantConnectionDryRun([[1, 2], [1, 3], [2, 3]]);
    const finalFrame = frames[frames.length - 1];

    expect(finalFrame.result).toEqual([2, 3]);
    expect(finalFrame.redundantEdge).toEqual([2, 3]);
    expect(finalFrame.acceptedEdges).toEqual([[1, 2], [1, 3]]);
  });

  test("stops after the first cycle in official example two", () => {
    const { frames } = createRedundantConnectionDryRun([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]);
    const finalFrame = frames[frames.length - 1];

    expect(finalFrame.result).toEqual([1, 4]);
    expect(finalFrame.acceptedEdges).toEqual([[1, 2], [2, 3], [3, 4]]);
    expect(frames.some((frame) => frame.currentEdge?.[0] === 1 && frame.currentEdge?.[1] === 5)).toBe(false);
  });

  test("records path compression after a recursive find", () => {
    const { frames } = createRedundantConnectionDryRun([[1, 2], [2, 3], [3, 4], [1, 4]]);

    expect(frames.some((frame) => frame.compressingNode === 1 && frame.parent[1] === 4)).toBe(true);
  });
});
