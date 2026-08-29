import { describe, expect, test } from "vitest";
import { createValidPalindromeIIDryRun } from "./dryRun";
describe("Valid Palindrome II dry run", () => { test("branches once at the mismatch", () => { const { frames } = createValidPalindromeIIDryRun("abca"); expect(frames[frames.length - 1]?.result).toBe(true); expect(frames.some((frame) => frame.phase === "branch")).toBe(true); }); });
