import type { LinearDpExample } from "../../shared/components/LinearDpVisualizer";

export type TribonacciInput = { n: number };

export const title = "1137. N-th Tribonacci Number";
export const examples: LinearDpExample<TribonacciInput>[] = [
  { id: 1, label: "LeetCode 1", input: { n: 4 }, output: 4 },
  { id: 2, label: "LeetCode 2", input: { n: 25 }, output: 1389537 },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def tribonacci(self, n: int) -> int:",
  "        if n == 0:",
  "            return 0",
  "        if n == 1 or n == 2:",
  "            return 1",
  "",
  "        dp = [0] * (n + 1)",
  "",
  "        dp[0] = 0",
  "        dp[1] = 1",
  "        dp[2] = 1",
  "",
  "        for i in range(3, n + 1):",
  "            dp[i] = dp[i - 1] + dp[i - 2] + dp[i - 3]",
  "",
  "        return dp[n]",
];
