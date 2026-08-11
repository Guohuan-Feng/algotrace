import { describe, expect, it } from "vitest";
import { createRottingOrangesDryRun } from "./dryRun";

describe("createRottingOrangesDryRun", () => {
  it("spreads rot one BFS level per minute and reports unreachable fruit", () => {
    const reachableFrames = createRottingOrangesDryRun([[2, 1, 1], [1, 1, 0], [0, 1, 1]]).frames;
    const unreachableFrames = createRottingOrangesDryRun([[2, 1, 1], [0, 1, 1], [1, 0, 1]]).frames;
    const reachable = reachableFrames[reachableFrames.length - 1];
    const unreachable = unreachableFrames[unreachableFrames.length - 1];

    expect(reachable?.minutes).toBe(4);
    expect(reachable?.result).toBe(4);
    expect(unreachable?.result).toBe(-1);
  });
});
