import { describe, expect, test } from "vitest";
import { createPalindromicSubstringsDryRun } from "./dryRun";

describe("Palindromic Substrings dry run", () => {
  test("counts the three single-character palindromes in abc", () => {
    const { frames } = createPalindromicSubstringsDryRun("abc");

    expect(frames[frames.length - 1]?.result).toBe(3);
  });

  test("counts every odd and even palindrome in aaa", () => {
    const { frames } = createPalindromicSubstringsDryRun("aaa");

    expect(frames[frames.length - 1]?.result).toBe(6);
    expect(frames.some((frame) => frame.foundPalindrome === "aaa")).toBe(true);
  });
});
