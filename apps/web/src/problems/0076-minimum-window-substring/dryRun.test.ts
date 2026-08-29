import { describe, expect, test } from "vitest";
import { createMinimumWindowDryRun } from "./dryRun";

describe("Minimum Window Substring dry run", () => {
  test("keeps shrinking a valid window until it finds BANC in LeetCode example 1", () => {
    const { frames } = createMinimumWindowDryRun("ADOBECODEBANC", "ABC");
    const banc = frames.find((frame) => frame.phase === "best" && frame.candidate === "BANC");

    expect(banc).toMatchObject({ best: [9, 12], formed: 3 });
    expect(frames[frames.length - 1]?.result).toBe("BANC");
  });

  test("returns the one-character window in LeetCode example 2", () => {
    const { frames } = createMinimumWindowDryRun("a", "a");

    expect(frames[frames.length - 1]?.result).toBe("a");
  });
});
