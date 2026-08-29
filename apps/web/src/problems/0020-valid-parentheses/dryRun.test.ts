import { describe, expect, test } from "vitest";
import { createValidParenthesesDryRun } from "./dryRun";

describe("Valid Parentheses dry run", () => {
  test("pops matching brackets and returns true only when the stack is empty", () => {
    const { frames } = createValidParenthesesDryRun("()[]{}");
    const last = frames[frames.length - 1]!;

    expect(last.result).toBe(true);
    expect(last.stack).toEqual([]);
    expect(frames.some((frame) => frame.phase === "pop")).toBe(true);
  });

  test("stops on a closing bracket that does not match the stack top", () => {
    const { frames } = createValidParenthesesDryRun("(]");
    const last = frames[frames.length - 1]!;

    expect(last.result).toBe(false);
    expect(last.phase).toBe("mismatch");
  });
});
