export type HouseRobberIiInput = { nums: number[] };

export const title = "213. House Robber II";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { nums: [2, 3, 2] }, output: 3 },
  { id: 2, label: "LeetCode 2", input: { nums: [1, 2, 3, 1] }, output: 4 },
] satisfies Array<{ id: number; label: string; input: HouseRobberIiInput; output: number }>;
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def rob(self, nums: List[int]) -> int:",
  "        n = len(nums)",
  "",
  "        if n == 1:",
  "            return nums[0]",
  "",
  "        def robLinear(arr):",
  "            m = len(arr)",
  "",
  "            if m == 1:",
  "                return arr[0]",
  "",
  "            dp = [0] * m",
  "            dp[0] = arr[0]",
  "            dp[1] = max(arr[0], arr[1])",
  "",
  "            for i in range(2, m):",
  "                dp[i] = max(dp[i - 1], dp[i - 2] + arr[i])",
  "",
  "            return dp[m - 1]",
  "",
  "        return max(",
  "            robLinear(nums[:-1]), robLinear(nums[1:])",
  "        )",
];
