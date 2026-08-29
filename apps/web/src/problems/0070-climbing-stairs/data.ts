import type { LinearDpExample } from "../../shared/components/LinearDpVisualizer";

export type ClimbingStairsInput = { n: number };

export const title = "70. Climbing Stairs";
export const examples: LinearDpExample<ClimbingStairsInput>[] = [
  { id: 1, label: "LeetCode 1", input: { n: 2 }, output: 2 },
  { id: 2, label: "LeetCode 2", input: { n: 3 }, output: 3 },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def climbStairs(self, n: int) -> int:",
  "        if n == 1:",
  "            return 1",
  "",
  "        dp = [0] * (n + 1)",
  "",
  "        dp[1] = 1",
  "        dp[2] = 2",
  "",
  "        for i in range(3, n + 1):",
  "            dp[i] = dp[i - 1] + dp[i - 2]",
  "",
  "        return dp[n]",
];
