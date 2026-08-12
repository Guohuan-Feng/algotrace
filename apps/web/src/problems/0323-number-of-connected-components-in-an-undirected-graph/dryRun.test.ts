import { describe, expect, test } from "vitest";
import { createConnectedComponentsDryRun } from "./dryRun";

describe("Number of Connected Components dry run", () => {
  test("starts a new DFS for each unvisited component", () => {
    const { frames } = createConnectedComponentsDryRun(5, [[0, 1], [1, 2], [3, 4]]);
    const finalFrame = frames[frames.length - 1];

    expect(frames.filter((frame) => frame.title.startsWith("Component ")).map((frame) => frame.count)).toEqual([1, 2]);
    expect(finalFrame.result).toBe(2);
    expect(finalFrame.visited).toEqual([0, 1, 2, 3, 4]);
  });

  test("returns one when DFS reaches every node from the first component", () => {
    const { frames } = createConnectedComponentsDryRun(5, [[0, 1], [1, 2], [2, 3], [3, 4]]);

    expect(frames[frames.length - 1].result).toBe(1);
  });
});
