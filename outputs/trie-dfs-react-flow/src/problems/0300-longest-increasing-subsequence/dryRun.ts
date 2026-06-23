import type { FrameKind } from "../../types";

export type LisFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  nums: number[];
  dp: number[];
  i: number | null;
  j: number | null;
  result: number | null;
};

export function createLisDryRun(nums: number[]): { frames: LisFrame[] } {
  const frames: LisFrame[] = [];
  const dp = Array(nums.length).fill(1);
  const push = (frame: Omit<LisFrame, "nums" | "dp">) => frames.push({ ...frame, nums: [...nums], dp: [...dp] });

  push({ kind: "start", title: "Initialize n", detail: `n = ${nums.length}.`, activeLines: [5], i: null, j: null, result: nums.length ? null : 0 });
  if (!nums.length) return { frames };
  push({ kind: "build", title: "Initialize dp", detail: "dp[i] means the LIS length ending exactly at i. Start all values at 1.", activeLines: [7], i: null, j: null, result: null });

  for (let i = 0; i < nums.length; i += 1) {
    push({ kind: "visit", title: `Fix i = ${i}`, detail: `Try every j before i to extend a subsequence ending at ${i}.`, activeLines: [9], i, j: null, result: null });
    for (let j = 0; j < i; j += 1) {
      push({ kind: "visit", title: `Compare j=${j} with i=${i}`, detail: `Check whether nums[${j}] = ${nums[j]} < nums[${i}] = ${nums[i]}.`, activeLines: [10, 11], i, j, result: null });
      if (nums[j] < nums[i]) {
        const old = dp[i];
        dp[i] = Math.max(dp[i], dp[j] + 1);
        push({ kind: dp[i] > old ? "build" : "prune", title: dp[i] > old ? `Update dp[${i}]` : "No better length", detail: `dp[${i}] = max(${old}, dp[${j}] + 1 = ${dp[j] + 1}) = ${dp[i]}.`, activeLines: [12], i, j, result: null });
      }
    }
  }

  push({ kind: "done", title: "Return max(dp)", detail: `The LIS length is ${Math.max(...dp)}.`, activeLines: [14], i: null, j: null, result: Math.max(...dp) });
  return { frames };
}
