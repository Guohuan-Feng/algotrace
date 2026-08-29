import type { LinearDpExample } from "../../shared/components/LinearDpVisualizer";

export type PerfectSquaresInput = { n: number };

export const title = "279. Perfect Squares";
export const examples: LinearDpExample<PerfectSquaresInput>[] = [
  { id: 1, label: "LeetCode 1", input: { n: 12 }, output: 3 },
  { id: 2, label: "LeetCode 2", input: { n: 13 }, output: 2 },
];
export const defaultExample = examples[0];
export const codeLines = [
  "class Solution:",
  "    def numSquares(self, n: int) -> int:",
  "        dp = [float('inf')] * (n + 1)",
  "        dp[0] = 0",
  "",
  "        for square in range(1, int(n ** 0.5) + 1):",
  "            square *= square",
  "            for i in range(square, n + 1):",
  "                dp[i] = min(dp[i], dp[i - square] + 1)",
  "",
  "        return dp[n]",
];
