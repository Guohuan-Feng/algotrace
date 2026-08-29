import { describe, expect, test } from "vitest";
import { createValidPalindromeDryRun } from "./dryRun";

describe("Valid Palindrome dry run", () => {
  test("skips punctuation and accepts the official first example", () => {
    const { frames } = createValidPalindromeDryRun("A man, a plan, a canal: Panama");
    const done = frames[frames.length - 1];

    expect(done?.result).toBe(true);
    expect(done?.normalized).toBe("amanaplanacanalpanama");
  });

  test("stops at the mismatching characters in the official second example", () => {
    const { frames } = createValidPalindromeDryRun("race a car");
    const mismatch = frames.find((frame) => frame.phase === "mismatch");

    expect(frames[frames.length - 1]?.result).toBe(false);
    expect(mismatch?.leftChar).toBe("e");
    expect(mismatch?.rightChar).toBe("a");
  });
});
