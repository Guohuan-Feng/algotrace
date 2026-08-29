import { describe, expect, test } from "vitest";
import { createNetworkDelayDryRun } from "./dryRun";

describe("Network Delay Time dry run", () => {
  test("settles Dijkstra distances and returns the farthest reachable delay", () => {
    const { frames } = createNetworkDelayDryRun([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2);
    const finalFrame = frames[frames.length - 1];

    expect(finalFrame?.dist).toEqual([Number.POSITIVE_INFINITY, 1, 0, 1, 2]);
    expect(finalFrame?.result).toBe(2);
  });
});
