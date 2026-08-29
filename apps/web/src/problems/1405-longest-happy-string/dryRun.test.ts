import { describe, expect, test } from "vitest";
import { createLongestHappyStringDryRun } from "./dryRun";

describe("Longest Happy String dry run", () => {
  test("uses the second heap character when the first would create three equal characters", () => {
    const { frames } = createLongestHappyStringDryRun(1, 1, 7);
    const last = frames[frames.length - 1]!;

    expect(last.result).toBe("ccaccbcc");
    expect(frames.some((frame) => frame.phase === "fallback")).toBe(true);
  });
});
