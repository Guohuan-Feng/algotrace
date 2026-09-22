import { describe, expect, test } from "vitest";
import { codeLines, defaultExample, examples, parseInput } from "./data";
import { createRemoveDuplicatesIIDryRun } from "./dryRun";

describe("Remove Duplicates from Sorted Array II dry run", () => {
  test.each(examples)("returns the expected prefix for $label", ({ input, output }) => {
    const { frames } = createRemoveDuplicatesIIDryRun(input);
    expect(frames[frames.length - 1]!.result).toEqual(output);
  });

  test("shows exact in-place overwrites while leaving the unused suffix visible", () => {
    const { frames } = createRemoveDuplicatesIIDryRun(defaultExample.input);
    const writes = frames.filter((frame) => frame.phase === "write");
    expect(writes.map((frame) => frame.writtenIndex)).toEqual([2, 3, 4, 5, 6]);
    expect(writes[2]!.nums).toEqual([0, 0, 1, 1, 2, 1, 2, 3, 3]);
    expect(writes[3]!.nums).toEqual([0, 0, 1, 1, 2, 3, 2, 3, 3]);
    expect(writes[4]!.nums).toEqual([0, 0, 1, 1, 2, 3, 3, 3, 3]);
    expect(frames.filter((frame) => frame.phase === "skip").map((frame) => frame.right)).toEqual([4, 5]);
  });

  test("compares against the live overwritten array rather than the original input", () => {
    const { frames } = createRemoveDuplicatesIIDryRun([1, 1, 1, 2, 2, 2]);
    const comparison = frames.find((frame) => frame.phase === "compare" && frame.right === 5)!;
    expect(comparison.left).toBe(4);
    expect(comparison.compareIndex).toBe(2);
    expect(comparison.nums[2]).toBe(2);
    expect(comparison.comparison).toEqual({ candidate: 2, reference: 2, keep: false });
    expect(frames[frames.length - 1]!.result).toEqual({ k: 4, nums: [1, 1, 2, 2] });
  });

  test("separates comparison, writing, and advancing the valid prefix", () => {
    const { frames } = createRemoveDuplicatesIIDryRun(defaultExample.input);
    const index = frames.findIndex((frame) => frame.phase === "compare" && frame.right === 6);
    const [comparison, write, advance] = frames.slice(index, index + 3);
    expect([comparison!.phase, write!.phase, advance!.phase]).toEqual(["compare", "write", "advance"]);
    expect(comparison!.nums[4]).toBe(1);
    expect(write!.nums[4]).toBe(2);
    expect([comparison!.left, write!.left, advance!.left]).toEqual([4, 4, 5]);
    expect(write!.result).toEqual({ k: null, nums: [0, 0, 1, 1] });
    expect(advance!.result).toEqual({ k: null, nums: [0, 0, 1, 1, 2] });
    expect([comparison!.compareIndex, write!.compareIndex, advance!.compareIndex]).toEqual([2, 2, null]);
  });

  test.each([[], [7], [7, 7], [-1, 5]].map((input) => ({ input })))("short-circuits without initializing pointers for $input", ({ input }) => {
    const { frames } = createRemoveDuplicatesIIDryRun(input);
    expect(frames.map((frame) => frame.phase)).toEqual(["guard", "done"]);
    expect(frames.every((frame) => frame.left === null && frame.right === null)).toBe(true);
    expect(frames[1]!.result).toEqual({ k: input.length, nums: input });
    expect(frames[1]!.activeLines).toEqual([4]);
  });

  test("keeps the input and every historical snapshot independent", () => {
    const input = [...defaultExample.input];
    const { frames } = createRemoveDuplicatesIIDryRun(input);
    expect(input).toEqual(defaultExample.input);
    input[0] = 99;
    expect(frames[0]!.nums[0]).toBe(0);
    const compareIndex = frames.findIndex((frame) => frame.phase === "compare");
    const compare = frames[compareIndex]!;
    const write = frames[compareIndex + 1]!;
    compare.nums[0] = 88;
    compare.result.nums[0] = 77;
    compare.comparison!.reference = 66;
    compare.activeLines[0] = 55;
    expect(write.nums[0]).toBe(0);
    expect(write.result.nums[0]).toBe(0);
    expect(write.comparison!.reference).toBe(0);
    expect(write.activeLines).toEqual([10]);
    expect(frames[frames.length - 1]!.result).toEqual(defaultExample.output);
  });

  test("maps one-based active lines to the exact Python statements", () => {
    const { frames } = createRemoveDuplicatesIIDryRun(defaultExample.input);
    const statements = {
      guard: ["if len(nums) <= 2:"],
      initialize: ["left = 2"],
      compare: ["for right in range(2, len(nums)):", "if nums[right] != nums[left - 2]:"],
      write: ["nums[left] = nums[right]"],
      advance: ["left += 1"],
      skip: ["if nums[right] != nums[left - 2]:"],
      done: ["return left"],
    };
    for (const frame of frames) {
      expect(frame.activeLines.map((line) => codeLines[line - 1]!.trim())).toEqual(statements[frame.phase]);
    }
    const shortRun = createRemoveDuplicatesIIDryRun([]);
    expect(shortRun.frames[1]!.activeLines.map((line) => codeLines[line - 1]!.trim())).toEqual(["return len(nums)"]);
  });

  test("preserves the prefix invariants and agrees with counting for every small sorted input", () => {
    const inputs: number[][] = [];
    const enumerate = (prefix: number[], minimum: number) => {
      inputs.push(prefix);
      if (prefix.length === 7) return;
      for (let value = minimum; value <= 2; value += 1) enumerate([...prefix, value], value);
    };
    enumerate([], -1);

    for (const input of inputs) {
      const counts = new Map<number, number>();
      for (const value of input) counts.set(value, (counts.get(value) ?? 0) + 1);
      const expected = [...counts].flatMap(([value, count]) => Array<number>(Math.min(2, count)).fill(value));
      const { frames } = createRemoveDuplicatesIIDryRun(input);
      expect(frames[frames.length - 1]!.result).toEqual({ k: expected.length, nums: expected });
      for (const frame of frames) {
        expect(frame.nums).toHaveLength(input.length);
        if (frame.left !== null) {
          expect(frame.left).toBe(frame.result.nums.length);
          expect(frame.result.nums).toEqual(frame.nums.slice(0, frame.left));
          expect(frame.left).toBeGreaterThanOrEqual(2);
          expect(frame.left).toBeLessThanOrEqual(input.length);
        }
        for (let index = 0; index < frame.result.nums.length; index += 1) {
          if (index > 0) expect(frame.result.nums[index]).toBeGreaterThanOrEqual(frame.result.nums[index - 1]!);
          if (index > 1) expect(frame.result.nums[index]).not.toBe(frame.result.nums[index - 2]);
        }
        if (frame.compareIndex !== null) {
          expect(frame.compareIndex).toBe(frame.left! - 2);
          expect(frame.comparison!.reference).toBe(frame.nums[frame.compareIndex]);
        }
        if (frame.phase === "compare" || frame.phase === "skip" || frame.phase === "write") {
          expect(frame.left).toBeLessThanOrEqual(frame.right!);
        }
        if (frame.right !== null) expect(frame.nums.slice(frame.right + 1)).toEqual(input.slice(frame.right + 1));
      }
    }
  });
});

describe("sorted integer input validation", () => {
  test("accepts both supported shapes and returns independent arrays", () => {
    const nums = [-2, -2, 0, 3];
    expect(parseInput(nums)).toEqual(nums);
    expect(parseInput({ nums })).toEqual(nums);
    expect(parseInput(nums)).not.toBe(nums);
    expect(parseInput({ nums })).not.toBe(nums);
    expect(parseInput(Array<number>(40).fill(0))).toHaveLength(40);
  });

  test.each([
    { value: null }, { value: {} }, { value: "[1,2]" }, { value: { nums: "1,2" } },
    { value: [1, 0] }, { value: [1, 1.5] }, { value: ["1"] }, { value: [NaN] },
    { value: [Infinity] }, { value: [Number.MAX_SAFE_INTEGER + 1] },
    { value: new Array(2) }, { value: Array<number>(41).fill(1) },
  ])("rejects invalid input $value", ({ value }) => {
    expect(() => parseInput(value)).toThrow();
  });
});
