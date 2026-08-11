export type LisExample = { id: 1 | 2 | 3; label: string; nums: number[]; output: number };

export const title = "300. Longest Increasing Subsequence";

export const examples: LisExample[] = [
  { id: 1, label: "LeetCode 1", nums: [10, 9, 2, 5, 3, 7, 101, 18], output: 4 },
  { id: 2, label: "LeetCode 2", nums: [0, 1, 0, 3, 2, 3], output: 4 },
  { id: 3, label: "LeetCode 3", nums: [7, 7, 7, 7, 7, 7, 7], output: 1 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def lengthOfLIS(self, nums: List[int]) -> int:",
  "        n = len(nums)",
  "",
  "        dp = [1] * n",
  "",
  "        for i in range(n):",
  "            for j in range(i):",
  "                if nums[j] < nums[i]:",
  "                    dp[i] = max(dp[i], dp[j] + 1)",
  "",
  "        return max(dp)",
];
