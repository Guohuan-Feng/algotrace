import { describe, expect, test } from "vitest";
import { createStackUsingQueuesDryRun } from "./dryRun";

describe("Implement Stack using Queues dry run", () => {
  test("rotates the newly pushed value to the front so a queue behaves as a stack", () => {
    const { frames } = createStackUsingQueuesDryRun([{ method: "push", value: 1 }, { method: "push", value: 2 }, { method: "top" }, { method: "pop" }, { method: "empty" }]);
    const rotate = frames.find((frame) => frame.phase === "rotate" && frame.queue.join(",") === "2,1");
    const pop = frames.find((frame) => frame.phase === "pop");

    expect(rotate).toBeDefined();
    expect(pop).toMatchObject({ output: 2, queue: [1] });
    expect(frames[frames.length - 1]?.output).toBe(false);
  });
});
