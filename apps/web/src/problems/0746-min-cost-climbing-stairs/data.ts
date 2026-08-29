import type { LinearDpExample } from "../../shared/components/LinearDpVisualizer";

export type MinCostClimbingStairsInput = { cost: number[] };

export const title = "746. Min Cost Climbing Stairs";
export const examples: LinearDpExample<MinCostClimbingStairsInput>[] = [
  { id: 1, label: "LeetCode 1", input: { cost: [10, 15, 20] }, output: 15 },
  { id: 2, label: "LeetCode 2", input: { cost: [1, 100, 1, 1, 1, 100, 1, 1, 100, 1] }, output: 6 },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def minCostClimbingStairs(self, cost: List[int]) -> int:",
  "        n = len(cost)",
  "",
  "        dp = [0] * n",
  "        dp[0] = cost[0]",
  "        dp[1] = cost[1]",
  "",
  "        for i in range(2, n):",
  "            dp[i] = cost[i] + min(dp[i - 1], dp[i - 2])",
  "",
  "        return min(dp[n - 1], dp[n - 2])",
];
