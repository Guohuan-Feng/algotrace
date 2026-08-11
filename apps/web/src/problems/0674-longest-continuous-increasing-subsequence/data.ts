export type LcisExample = { id: 1 | 2 | 3; label: string; nums: number[]; output: number };

export const title = "674. Longest Continuous Increasing Subsequence";

export const examples: LcisExample[] = [
  { id: 1, label: "LeetCode 1", nums: [1, 3, 5, 4, 7], output: 3 },
  { id: 2, label: "LeetCode 2", nums: [2, 2, 2, 2, 2], output: 1 },
  { id: 3, label: "Empty", nums: [], output: 0 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def findLengthOfLCIS(self, nums: List[int]) -> int:",
  "        if not nums:",
  "            return 0",
  "",
  "        n = len(nums)",
  "        dp = [1] * n",
  "",
  "        for i in range(1, n):",
  "            if nums[i - 1] < nums[i]:",
  "                dp[i] = dp[i - 1] + 1",
  "            else:",
  "                dp[i] = 1",
  "",
  "        return max(dp)",
];
