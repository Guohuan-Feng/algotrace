import type { LinearDpFrame } from "../../shared/components/LinearDpVisualizer";

export type CombinationSumIvFrame = LinearDpFrame & { target: number; num: number | null };

export function createCombinationSumIvDryRun(nums: number[], target: number): { frames: CombinationSumIvFrame[] } {
  const frames: CombinationSumIvFrame[] = [];
  const dp = Array<number>(target + 1).fill(0);
  dp[0] = 1;
  const push = (frame: Omit<CombinationSumIvFrame, "dp">) => frames.push({ ...frame, dp: [...dp] });

  push({ kind: "start", title: "Seed dp[0] = 1", detail: "There is one ordered way to form target 0: choose nothing.", activeLines: [3, 4], currentIndex: 0, previousIndex: null, outerLabel: "target = -", innerLabel: "num = -", candidateLabel: null, result: null, target: 0, num: null });
  for (let i = 1; i <= target; i += 1) {
    push({ kind: "visit", title: `Count ways to form ${i}`, detail: "The outer loop over target values makes different number orders count separately.", activeLines: [6], currentIndex: i, previousIndex: null, outerLabel: `target i = ${i}`, innerLabel: "choose a num", candidateLabel: null, result: null, target: i, num: null });
    for (const num of nums) {
      if (i < num) {
        push({ kind: "prune", title: `${num} is too large for ${i}`, detail: "The guard i >= num is false, so this number cannot end a sequence for the current target.", activeLines: [7, 8], currentIndex: i, previousIndex: null, outerLabel: `target i = ${i}`, innerLabel: `num = ${num}`, candidateLabel: null, result: null, target: i, num });
        continue;
      }
      const before = dp[i];
      const add = dp[i - num];
      dp[i] += add;
      push({ kind: "found", title: `Add ${add} way${add === 1 ? "" : "s"} using ${num}`, detail: `dp[${i}] += dp[${i - num}] changes ${before} to ${dp[i]}.`, activeLines: [7, 8, 9], currentIndex: i, previousIndex: i - num, outerLabel: `target i = ${i}`, innerLabel: `num = ${num}`, candidateLabel: `add = ${add}`, result: null, target: i, num });
    }
  }
  push({ kind: "done", title: `Return dp[${target}] = ${dp[target]}`, detail: "The array now contains the number of ordered combinations for each target.", activeLines: [11], currentIndex: null, previousIndex: null, outerLabel: "all targets processed", innerLabel: "done", candidateLabel: null, result: dp[target], target, num: null });
  return { frames };
}
