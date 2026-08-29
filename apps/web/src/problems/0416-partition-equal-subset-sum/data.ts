import type { LinearDpExample } from "../../shared/components/LinearDpVisualizer";

export type PartitionEqualSubsetSumInput = { nums: number[] };

export const title = "416. Partition Equal Subset Sum";
export const examples: LinearDpExample<PartitionEqualSubsetSumInput>[] = [
  { id: 1, label: "LeetCode 1", input: { nums: [1, 5, 11, 5] }, output: true },
  { id: 2, label: "LeetCode 2", input: { nums: [1, 2, 3, 5] }, output: false },
];
export const defaultExample = examples[0];
export const codeLines = [
  "class Solution:",
  "    def canPartition(self, nums: List[int]) -> bool:",
  "        total = sum(nums)",
  "",
  "        if total % 2 != 0:",
  "            return False",
  "",
  "        target = total // 2",
  "        dp = [False] * (target + 1)",
  "        dp[0] = True",
  "",
  "        for num in nums:",
  "            for j in range(target, num - 1, -1):",
  "                dp[j] = dp[j] or dp[j - num]",
  "",
  "        return dp[target]",
];
