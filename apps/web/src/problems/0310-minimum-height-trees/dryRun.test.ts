import { describe, expect, test } from "vitest";
import { createMinimumHeightTreesDryRun } from "./dryRun";

describe("Minimum Height Trees dry run", () => {
  test("repeatedly removes leaves until the center remains", () => {
    const { frames } = createMinimumHeightTreesDryRun(4, [[1, 0], [1, 2], [1, 3]]);
    const finalFrame = frames[frames.length - 1];

    expect(finalFrame?.remaining).toBe(1);
    expect(finalFrame?.result).toEqual([1]);
  });
});
