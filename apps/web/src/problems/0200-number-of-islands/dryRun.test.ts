import { describe, expect, test } from "vitest";
import { createNumberOfIslandsDryRun } from "./dryRun";

describe("Number of Islands dry run", () => {
  test("mutates each discovered island to water and counts three components", () => {
    const { frames } = createNumberOfIslandsDryRun([
      ["1", "1", "0", "0", "0"],
      ["1", "1", "0", "0", "0"],
      ["0", "0", "1", "0", "0"],
      ["0", "0", "0", "1", "1"],
    ]);
    const last = frames[frames.length - 1]!;

    expect(last.result).toBe(3);
    expect(last.count).toBe(3);
  });
});
