import { describe, expect, test } from "vitest";
import { createGraphValidTreeDryRun } from "./dryRun";

describe("Graph Valid Tree dry run", () => {
  test("visits every node and returns true for the first example", () => {
    const { frames } = createGraphValidTreeDryRun(5, [[0, 1], [0, 2], [0, 3], [1, 4]]);
    const finalFrame = frames[frames.length - 1];

    expect(finalFrame.result).toBe(true);
    expect(finalFrame.visited).toEqual([0, 1, 2, 3, 4]);
    expect(finalFrame.activeLines).toEqual([31]);
  });

  test("stops when DFS finds a non-parent edge to an already visited node", () => {
    const { frames } = createGraphValidTreeDryRun(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]);

    expect(frames.some((frame) => frame.cycleEdge?.[0] === 3 && frame.cycleEdge?.[1] === 1)).toBe(true);
    expect(frames.some((frame) => frame.activeLines.includes(14) && frame.title === "Cycle detected")).toBe(true);
    expect(frames[frames.length - 1].result).toBe(false);
  });

  test("returns false when an acyclic graph does not reach every node", () => {
    const { frames } = createGraphValidTreeDryRun(4, [[0, 1], [2, 3]]);
    const finalFrame = frames[frames.length - 1];

    expect(finalFrame.cycleEdge).toBeNull();
    expect(finalFrame.result).toBe(false);
    expect(finalFrame.visited).toEqual([0, 1]);
  });
});
