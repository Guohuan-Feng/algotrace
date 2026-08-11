import { describe, expect, test } from "vitest";
import { createSurroundedRegionsDryRun } from "./dryRun";

describe("Surrounded Regions dry run", () => {
  test("preserves boundary-connected cells and flips enclosed cells", () => {
    const { frames } = createSurroundedRegionsDryRun([
      ["X", "X", "X", "X"],
      ["X", "O", "O", "X"],
      ["X", "X", "O", "X"],
      ["X", "O", "X", "X"],
    ]);
    const finalFrame = frames[frames.length - 1];

    expect(frames.some((frame) => frame.currentCell?.[0] === 3 && frame.currentCell?.[1] === 1)).toBe(true);
    expect(finalFrame.board).toEqual([
      ["X", "X", "X", "X"],
      ["X", "X", "X", "X"],
      ["X", "X", "X", "X"],
      ["X", "O", "X", "X"],
    ]);
  });
});
