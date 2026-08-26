import { describe, expect, test } from "vitest";
import { createLongestPalindromicSubstringDryRun } from "./dryRun";

describe("Longest Palindromic Substring dry run", () => {
  test("keeps bab for the supplied center-expansion code on babad", () => {
    const { frames } = createLongestPalindromicSubstringDryRun("babad");

    expect(frames[frames.length - 1]?.result).toBe("bab");
  });

  test("finds the even-length palindrome bb in cbbd", () => {
    const { frames } = createLongestPalindromicSubstringDryRun("cbbd");

    expect(frames[frames.length - 1]?.result).toBe("bb");
    expect(frames.some((frame) => frame.res === "bb")).toBe(true);
  });
});
