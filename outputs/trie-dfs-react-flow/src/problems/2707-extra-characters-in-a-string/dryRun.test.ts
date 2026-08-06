import { describe, expect, it } from "vitest";
import { createExtraCharactersDryRun } from "./dryRun";

describe("createExtraCharactersDryRun", () => {
  it("uses a dictionary match to replace the default extra-character cost", () => {
    const { frames } = createExtraCharactersDryRun("leetscode", ["leet", "code", "leetcode"]);
    const leetUpdate = frames.find((frame) => frame.i === 4 && frame.j === 0 && frame.matchedWord === "leet" && frame.activeLines.includes(17));
    const finalFrame = frames[frames.length - 1];

    expect(leetUpdate?.dp[4]).toBe(0);
    expect(finalFrame?.result).toBe(1);
    expect(finalFrame?.dp).toEqual([0, 1, 2, 3, 0, 1, 2, 3, 4, 1]);
  });
});
