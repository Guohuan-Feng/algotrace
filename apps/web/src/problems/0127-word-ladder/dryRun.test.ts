import { describe, expect, test } from "vitest";
import { createWordLadderDryRun } from "./dryRun";

describe("Word Ladder dry run", () => {
  test("uses level-order BFS to reach cog in five words", () => {
    const { frames } = createWordLadderDryRun("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]);
    const finalFrame = frames[frames.length - 1];

    expect(frames.some((frame) => frame.queuedWord === "cog" && frame.queue.some(([word, step]) => word === "cog" && step === 5))).toBe(true);
    expect(finalFrame?.result).toBe(5);
  });
});
