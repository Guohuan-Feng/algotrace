import { describe, expect, test } from "vitest";
import { createMinStackDryRun } from "./dryRun";

describe("Min Stack dry run", () => {
  test("keeps a synchronized minimum stack through push, pop, top, and getMin", () => {
    const { frames } = createMinStackDryRun(["push -2", "push 0", "push -3", "getMin", "pop", "top", "getMin"]);
    const last = frames[frames.length - 1]!;

    expect(last.outputs).toEqual([-3, 0, -2]);
    expect(last.stack).toEqual([-2, 0]);
    expect(last.minStack).toEqual([-2, -2]);
  });
});
