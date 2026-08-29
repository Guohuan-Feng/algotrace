import { describe, expect, test } from "vitest";
import { createLongestSubstringDryRun } from "./dryRun";

describe("Longest Substring Without Repeating Characters dry run", () => {
  test("moves the left pointer past the prior a in LeetCode example 1", () => {
    const { frames } = createLongestSubstringDryRun("abcabcbb");
    const removeA = frames.find((frame) => frame.phase === "remove" && frame.right === 3);

    expect(removeA).toMatchObject({ left: 1, chars: ["b", "c"] });
    expect(frames[frames.length - 1]?.result).toBe(3);
  });

  test("keeps a one-character window in LeetCode example 2", () => {
    const { frames } = createLongestSubstringDryRun("bbbbb");

    expect(frames[frames.length - 1]?.result).toBe(1);
  });
});
