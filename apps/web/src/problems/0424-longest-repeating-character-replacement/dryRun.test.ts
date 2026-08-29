import { describe, expect, test } from "vitest";
import { createCharacterReplacementDryRun } from "./dryRun";

describe("Longest Repeating Character Replacement dry run", () => {
  test("keeps the official AABA window with one replacement", () => {
    const { frames } = createCharacterReplacementDryRun("ABAB", 2);

    expect(frames[frames.length - 1]?.result).toBe(4);
    expect(frames.some((frame) => frame.best === 4)).toBe(true);
  });

  test("shrinks the official AABABBA window after it becomes invalid", () => {
    const { frames } = createCharacterReplacementDryRun("AABABBA", 1);

    expect(frames[frames.length - 1]?.result).toBe(4);
    expect(frames.some((frame) => frame.phase === "shrink")).toBe(true);
  });
});
