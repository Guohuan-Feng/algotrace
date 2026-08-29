import { describe, expect, test } from "vitest";
import { createIslandPerimeterDryRun } from "./dryRun";

describe("Island Perimeter dry run", () => {
  test("returns 16 after DFS counts every water-facing island edge", () => {
    const { frames } = createIslandPerimeterDryRun([
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 1, 0, 0],
      [1, 1, 0, 0],
    ]);

    const last = frames[frames.length - 1]!;
    expect(last.result).toBe(16);
    expect(last.perimeter).toBe(16);
  });
});
