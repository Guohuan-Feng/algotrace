import type { FrameKind } from "../../shared/types";

export type MaximumProductFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  nums: number[];
  index: number | null;
  num: number | null;
  oldMax: number | null;
  curMax: number;
  curMin: number;
  result: number;
  phase: "initialize" | "store" | "max" | "min" | "result" | "done";
};

export function createMaximumProductDryRun(nums: number[]): { frames: MaximumProductFrame[] } {
  const frames: MaximumProductFrame[] = [];
  let curMax = nums[0]!;
  let curMin = nums[0]!;
  let result = nums[0]!;
  const push = (frame: Omit<MaximumProductFrame, "nums" | "curMax" | "curMin" | "result">) => frames.push({
    ...frame,
    nums: [...nums],
    curMax,
    curMin,
    result,
  });

  push({ kind: "start", title: "Seed every product state", detail: "A subarray ending at index 0 has one product: the first value itself.", activeLines: [3, 4, 5], index: 0, num: nums[0]!, oldMax: null, phase: "initialize" });

  for (let index = 1; index < nums.length; index += 1) {
    const num = nums[index]!;
    const oldMax = curMax;
    const previousMin = curMin;
    push({ kind: "visit", title: `Remember old cur_max = ${oldMax}`, detail: "cur_max changes before cur_min, so the submitted code saves the old maximum first.", activeLines: [7, 8], index, num, oldMax, phase: "store" });

    curMax = Math.max(num, oldMax * num, previousMin * num);
    push({ kind: "visit", title: `Update cur_max to ${curMax}`, detail: `max(${num}, ${oldMax} x ${num}, ${previousMin} x ${num}) = ${curMax}.`, activeLines: [10], index, num, oldMax, phase: "max" });

    curMin = Math.min(num, oldMax * num, previousMin * num);
    push({ kind: "visit", title: `Update cur_min to ${curMin}`, detail: `min(${num}, ${oldMax} x ${num}, ${previousMin} x ${num}) = ${curMin}.`, activeLines: [12], index, num, oldMax, phase: "min" });

    const before = result;
    result = Math.max(result, curMax);
    push({ kind: result > before ? "found" : "visit", title: result > before ? `New best product: ${result}` : `Keep best product: ${result}`, detail: `res = max(${before}, ${curMax}) = ${result}.`, activeLines: [14], index, num, oldMax, phase: "result" });
  }

  push({ kind: "done", title: `Return ${result}`, detail: "res is the maximum product of every contiguous subarray examined by the loop.", activeLines: [16], index: null, num: null, oldMax: null, phase: "done" });
  return { frames };
}
