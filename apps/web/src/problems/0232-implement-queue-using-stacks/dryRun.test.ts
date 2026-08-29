import { describe, expect, test } from "vitest";
import { createQueueUsingStacksDryRun } from "./dryRun";

describe("Implement Queue using Stacks dry run", () => {
  test("transfers input items once before reading the oldest queued item", () => {
    const { frames } = createQueueUsingStacksDryRun([{ method: "push", value: 1 }, { method: "push", value: 2 }, { method: "peek" }, { method: "pop" }, { method: "empty" }]);
    const transfer = frames.find((frame) => frame.phase === "transfer" && frame.inStack.length === 0);
    const pop = frames.find((frame) => frame.phase === "pop");

    expect(transfer).toMatchObject({ outStack: [2, 1] });
    expect(pop).toMatchObject({ output: 1, outStack: [2] });
    expect(frames[frames.length - 1]?.output).toBe(false);
  });
});
