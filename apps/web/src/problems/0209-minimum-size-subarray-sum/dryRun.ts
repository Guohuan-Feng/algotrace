import type { FrameKind } from "../../shared/types";

export type MinimumSizeSubarraySumFrame = {
  kind: FrameKind;
  phase: "start" | "extend" | "valid" | "best" | "shrink" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  left: number;
  right: number;
  sum: number;
  best: number | null;
  result: number | null;
};

export function createMinimumSizeSubarraySumDryRun(target: number, nums: number[]): { frames: MinimumSizeSubarraySumFrame[] } {
  const frames: MinimumSizeSubarraySumFrame[] = [];
  let left = 0;
  let sum = 0;
  let best = Infinity;
  const snapshot = (frame: Omit<MinimumSizeSubarraySumFrame, "left" | "sum" | "best">) => frames.push({ ...frame, left, sum, best: Number.isFinite(best) ? best : null });

  snapshot({ kind: "start", phase: "start", title: "Start an empty window", detail: "Because every number is positive, moving right can only increase sum and moving left can only decrease it.", activeLines: [2, 3], right: -1, result: null });
  nums.forEach((num, right) => {
    sum += num;
    snapshot({ kind: "visit", phase: "extend", title: `Extend right to nums[${right}] = ${num}`, detail: `Add ${num}; the window sum is now ${sum}.`, activeLines: [5, 6], right, result: null });
    while (sum >= target) {
      snapshot({ kind: "found", phase: "valid", title: `Window sum ${sum} reaches target ${target}`, detail: `The current window [${left}, ${right}] is valid, so try shrinking it from the left.`, activeLines: [7], right, result: null });
      const length = right - left + 1;
      if (length < best) {
        best = length;
        snapshot({ kind: "found", phase: "best", title: `Best length becomes ${best}`, detail: `Window [${left}, ${right}] has length ${length}, the shortest valid length so far.`, activeLines: [8], right, result: null });
      }
      const removed = nums[left]!;
      sum -= removed;
      left += 1;
      snapshot({ kind: "backtrack", phase: "shrink", title: `Remove ${removed} and advance left`, detail: `Shrink to [${left}, ${right}] and reduce sum to ${sum}.`, activeLines: [9, 10], right, result: null });
    }
  });
  const result = Number.isFinite(best) ? best : 0;
  snapshot({ kind: "done", phase: "done", title: `Return ${result}`, detail: result ? `The shortest target-reaching window has length ${result}.` : "No contiguous window reaches the target.", activeLines: [12], right: nums.length - 1, result });
  return { frames };
}
