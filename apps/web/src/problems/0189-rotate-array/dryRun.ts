import type { FrameKind } from "../../shared/types";

export type RotateArrayFrame = {
  kind: FrameKind;
  phase: "start" | "normalize" | "reverse-all" | "reverse-prefix" | "reverse-suffix" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  nums: number[];
  k: number;
  range: [number, number] | null;
  active: [number, number] | null;
  result: number[] | null;
};

export function createRotateArrayDryRun(input: number[], originalK: number): { frames: RotateArrayFrame[] } {
  const frames: RotateArrayFrame[] = [];
  const nums = [...input];
  const k = originalK % nums.length;
  const snapshot = (frame: Omit<RotateArrayFrame, "nums" | "k">) => frames.push({ ...frame, nums: [...nums], k });

  snapshot({ kind: "start", phase: "start", title: "Prepare an in-place rotation", detail: `Rotate the array right by ${originalK} positions without allocating another array.`, activeLines: [2], range: null, active: null, result: null });
  snapshot({ kind: "build", phase: "normalize", title: `Normalize k to ${k}`, detail: `${originalK} % ${nums.length} = ${k}; only the remainder changes the final arrangement.`, activeLines: [3], range: null, active: null, result: null });

  reverse(0, nums.length - 1, "reverse-all", "Reverse the full array", [9]);
  reverse(0, k - 1, "reverse-prefix", `Reverse the first ${k} values`, [10]);
  reverse(k, nums.length - 1, "reverse-suffix", "Reverse the remaining suffix", [11]);
  snapshot({ kind: "done", phase: "done", title: "Rotation is complete", detail: "The three in-place reversals move the final k values to the front while preserving their order.", activeLines: [13], range: null, active: null, result: [...nums] });

  return { frames };

  function reverse(start: number, end: number, phase: RotateArrayFrame["phase"], label: string, activeLines: number[]) {
    snapshot({ kind: "visit", phase, title: label, detail: start > end ? "This range is empty, so no swap is needed." : `Swap values from both ends of [${start}, ${end}] until the pointers meet.`, activeLines, range: [start, end], active: null, result: null });
    let left = start;
    let right = end;
    while (left < right) {
      const beforeLeft = nums[left]!;
      const beforeRight = nums[right]!;
      [nums[left], nums[right]] = [nums[right]!, nums[left]!];
      snapshot({ kind: "build", phase, title: `Swap indices ${left} and ${right}`, detail: `${beforeLeft} and ${beforeRight} exchange positions inside the current reverse range.`, activeLines: [6, 7], range: [start, end], active: [left, right], result: null });
      left += 1;
      right -= 1;
    }
  }
}
