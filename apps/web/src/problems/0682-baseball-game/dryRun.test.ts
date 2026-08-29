import { describe, expect, test } from "vitest";
import { createBaseballGameDryRun } from "./dryRun";

describe("Baseball Game dry run", () => {
  test("handles score cancellation, doubling, and summing the previous two rounds", () => {
    const { frames } = createBaseballGameDryRun(["5", "2", "C", "D", "+"]);
    const plus = frames.find((frame) => frame.operation === "+" && frame.phase === "sum");

    expect(plus).toMatchObject({ scores: [5, 10, 15], total: 30 });
    expect(frames[frames.length - 1]?.result).toBe(30);
  });
});
