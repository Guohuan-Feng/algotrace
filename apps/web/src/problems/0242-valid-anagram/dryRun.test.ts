import { describe, expect, test } from "vitest";
import { createValidAnagramDryRun } from "./dryRun";

describe("Valid Anagram dry run", () => {
  test("builds and completely cancels the frequency table for the official anagram", () => {
    const { frames } = createValidAnagramDryRun("anagram", "nagaram");

    expect(frames[frames.length - 1]?.result).toBe(true);
    expect(frames.some((frame) => frame.phase === "decrement")).toBe(true);
  });

  test("rejects an unmatched character", () => {
    const { frames } = createValidAnagramDryRun("rat", "car");

    expect(frames[frames.length - 1]?.result).toBe(false);
  });
});
