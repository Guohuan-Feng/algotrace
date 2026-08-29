import { describe, expect, test } from "vitest";
import { createRepeatedSubstringDryRun } from "./dryRun";

describe("Repeated Substring Pattern dry run", () => {
  test("finds a repeated prefix in the first official example", () => {
    const { frames } = createRepeatedSubstringDryRun("abab");
    expect(frames[frames.length - 1]?.result).toBe(true);
    expect(frames.some((frame) => frame.pattern === "ab" && frame.matches)).toBe(true);
  });

  test("rejects the second official example", () => {
    const { frames } = createRepeatedSubstringDryRun("aba");
    expect(frames[frames.length - 1]?.result).toBe(false);
  });
});
