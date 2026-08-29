import { describe, expect, test } from "vitest";
import { createGuessNumberDryRun } from "./dryRun";

describe("Guess Number Higher or Lower dry run", () => {
  test("uses the official API responses to find pick 6", () => {
    const { frames } = createGuessNumberDryRun(10, 6);

    expect(frames[frames.length - 1]?.result).toBe(6);
    expect(frames.some((frame) => frame.response === 1)).toBe(true);
    expect(frames.some((frame) => frame.response === -1)).toBe(true);
  });

  test("returns the only number in the second official example", () => {
    const { frames } = createGuessNumberDryRun(1, 1);
    expect(frames[frames.length - 1]?.result).toBe(1);
  });
});
