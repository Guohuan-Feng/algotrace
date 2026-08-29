import type { LinearDpExample } from "../../shared/components/LinearDpVisualizer";

export type CombinationSumIvInput = { nums: number[]; target: number };

export const title = "377. Combination Sum IV";
export const examples: LinearDpExample<CombinationSumIvInput>[] = [
  { id: 1, label: "LeetCode 1", input: { nums: [1, 2, 3], target: 4 }, output: 7 },
  { id: 2, label: "LeetCode 2", input: { nums: [9], target: 3 }, output: 0 },
];
export const defaultExample = examples[0];
export const codeLines = [
  "class Solution:",
  "    def combinationSum4(self, nums: List[int], target: int) -> int:",
  "        dp = [0] * (target + 1)",
  "        dp[0] = 1",
  "",
  "        for i in range(1, target + 1):",
  "            for num in nums:",
  "                if i >= num:",
  "                    dp[i] += dp[i - num]",
  "",
  "        return dp[target]",
];
