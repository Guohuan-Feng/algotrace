import { describe, expect, test } from "vitest";
import { createRpnDryRun } from "./dryRun";

describe("Evaluate Reverse Polish Notation dry run", () => {
  test("pops b before a and pushes each arithmetic result", () => {
    const { frames } = createRpnDryRun(["2", "1", "+", "3", "*"]);
    const last = frames[frames.length - 1]!;

    expect(last.result).toBe(9);
    expect(last.stack).toEqual([9]);
    expect(frames.some((frame) => frame.phase === "apply" && frame.a === 2 && frame.b === 1)).toBe(true);
  });
});
