import type { LinearDpFrame } from "../../shared/components/LinearDpVisualizer";

export type PartitionEqualSubsetSumFrame = LinearDpFrame & { num: number | null; target: number | null; j: number | null };

export function createPartitionEqualSubsetSumDryRun(nums: number[]): { frames: PartitionEqualSubsetSumFrame[] } {
  const frames: PartitionEqualSubsetSumFrame[] = [];
  const total = nums.reduce((sum, num) => sum + num, 0);
  const push = (frame: Omit<PartitionEqualSubsetSumFrame, "dp">, dp: boolean[]) => frames.push({ ...frame, dp: [...dp] });

  if (total % 2 !== 0) {
    push({ kind: "prune", title: `Total ${total} is odd`, detail: "An odd total cannot be divided into two equal integer subsets.", activeLines: [3, 5, 6], currentIndex: null, previousIndex: null, outerLabel: `total = ${total}`, innerLabel: "return False", candidateLabel: null, result: false, num: null, target: null, j: null }, []);
    return { frames };
  }

  const target = total / 2;
  const dp = Array<boolean>(target + 1).fill(false);
  dp[0] = true;
  push({ kind: "start", title: `Target subset sum is ${target}`, detail: "dp[j] means some processed numbers can make sum j. dp[0] starts true.", activeLines: [8, 9, 10], currentIndex: 0, previousIndex: null, outerLabel: `total = ${total}`, innerLabel: `target = ${target}`, candidateLabel: null, result: null, num: null, target, j: null }, dp);

  for (const num of nums) {
    push({ kind: "visit", title: `Process number ${num}`, detail: "The inner loop runs from target down to num so this number cannot be used twice in one round.", activeLines: [12, 13], currentIndex: null, previousIndex: null, outerLabel: `num = ${num}`, innerLabel: `j: ${target} down to ${num}`, candidateLabel: null, result: null, num, target, j: null }, dp);
    for (let j = target; j >= num; j -= 1) {
      const before = dp[j];
      const source = dp[j - num];
      dp[j] = before || source;
      push({ kind: !before && source ? "found" : "prune", title: !before && source ? `Mark sum ${j} reachable` : `Keep dp[${j}] = ${dp[j] ? "True" : "False"}`, detail: `dp[${j}] = ${before ? "True" : "False"} or dp[${j - num}] = ${source ? "True" : "False"}.`, activeLines: [13, 14], currentIndex: j, previousIndex: j - num, outerLabel: `num = ${num}`, innerLabel: `j = ${j}`, candidateLabel: `source = ${source ? "T" : "F"}`, result: null, num, target, j }, dp);
    }
  }
  push({ kind: "done", title: `Return dp[${target}] = ${dp[target]}`, detail: "The target is reachable exactly when the numbers can be split into equal subsets.", activeLines: [16], currentIndex: target, previousIndex: null, outerLabel: "all numbers processed", innerLabel: "done", candidateLabel: null, result: dp[target], num: null, target, j: null }, dp);
  return { frames };
}
