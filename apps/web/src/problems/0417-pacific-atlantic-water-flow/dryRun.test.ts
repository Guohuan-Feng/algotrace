import { describe, expect, it } from "vitest";
import { createPacificAtlanticDryRun } from "./dryRun";

describe("createPacificAtlanticDryRun", () => {
  it("intersects the reverse-reachable Pacific and Atlantic cells", () => {
    const { frames } = createPacificAtlanticDryRun([
      [1, 2, 2, 3, 5],
      [3, 2, 3, 4, 4],
      [2, 4, 5, 3, 1],
      [6, 7, 1, 4, 5],
      [5, 1, 1, 2, 4],
    ]);
    const finalFrame = frames[frames.length - 1];
    const bothOceans = frames.find((frame) => (
      frame.current?.[0] === 2
      && frame.current?.[1] === 2
      && frame.phase === "collect"
      && frame.answer.some(([row, col]) => row === 2 && col === 2)
    ));

    expect(bothOceans?.answer).toContainEqual([2, 2]);
    expect(finalFrame?.answer).toEqual([[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]);
  });
});
