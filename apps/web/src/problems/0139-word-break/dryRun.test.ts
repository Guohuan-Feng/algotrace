import { describe, expect, test } from "vitest";
import { createWordBreakDryRun } from "./dryRun";

describe("Word Break dry run", () => {
  test("marks a prefix when the submitted code finds a valid prior split", () => {
    const { frames } = createWordBreakDryRun("leetcode", ["leet", "code"]);
    const codeMatch = frames.find((frame) => frame.i === 8 && frame.j === 4 && frame.candidate === "code" && frame.dp[8]);
    const finalFrame = frames[frames.length - 1];

    expect(codeMatch).toBeDefined();
    expect(finalFrame?.result).toBe(true);
  });
});
