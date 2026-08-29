import type { LinearDpFrame } from "../../shared/components/LinearDpVisualizer";

export type MinCostClimbingStairsFrame = LinearDpFrame & { cost: number[]; i: number | null };

export function createMinCostClimbingStairsDryRun(cost: number[]): { frames: MinCostClimbingStairsFrame[] } {
  const frames: MinCostClimbingStairsFrame[] = [];
  const dp = Array<number>(cost.length).fill(0);
  const push = (frame: Omit<MinCostClimbingStairsFrame, "dp" | "cost">) => frames.push({ ...frame, cost: [...cost], dp: [...dp] });

  dp[0] = cost[0]!;
  dp[1] = cost[1]!;
  push({ kind: "start", title: "Pay the first two landing costs", detail: "The submitted code seeds dp[0] and dp[1] directly from cost.", activeLines: [5, 7, 8, 9], currentIndex: 1, previousIndex: 0, outerLabel: "i = -", innerLabel: "base states", candidateLabel: `dp[0] = ${dp[0]}, dp[1] = ${dp[1]}`, result: null, i: null });

  for (let i = 2; i < cost.length; i += 1) {
    const fromOne = dp[i - 1]!;
    const fromTwo = dp[i - 2]!;
    dp[i] = cost[i]! + Math.min(fromOne, fromTwo);
    push({ kind: "found", title: `Land on step ${i} for ${dp[i]}`, detail: `cost[${i}] + min(dp[${i - 1}], dp[${i - 2}]) = ${cost[i]} + min(${fromOne}, ${fromTwo}) = ${dp[i]}.`, activeLines: [11, 12], currentIndex: i, previousIndex: fromOne <= fromTwo ? i - 1 : i - 2, outerLabel: `i = ${i}`, innerLabel: `cost[${i}] = ${cost[i]}`, candidateLabel: `min source = ${Math.min(fromOne, fromTwo)}`, result: null, i });
  }

  const result = Math.min(dp[cost.length - 1]!, dp[cost.length - 2]!);
  push({ kind: "done", title: `Return ${result}`, detail: "The top can be reached from either of the final two steps, so the code returns the cheaper total.", activeLines: [14], currentIndex: null, previousIndex: null, outerLabel: "top reached", innerLabel: "done", candidateLabel: `min(${dp[cost.length - 1]}, ${dp[cost.length - 2]})`, result, i: null });
  return { frames };
}
