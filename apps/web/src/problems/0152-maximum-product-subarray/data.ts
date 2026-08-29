export type MaximumProductInput = { nums: number[] };

export const title = "152. Maximum Product Subarray";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { nums: [2, 3, -2, 4] }, output: 6 },
  { id: 2, label: "LeetCode 2", input: { nums: [-2, 0, -1] }, output: 0 },
] satisfies Array<{ id: number; label: string; input: MaximumProductInput; output: number }>;
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def maxProduct(self, nums: List[int]) -> int:",
  "        cur_max = nums[0]",
  "        cur_min = nums[0]",
  "        res = nums[0]",
  "",
  "        for num in nums[1:]:",
  "            old_max = cur_max",
  "",
  "            cur_max = max(num, cur_max * num, cur_min * num)",
  "",
  "            cur_min = min(num, old_max * num, cur_min * num)",
  "",
  "            res = max(res, cur_max)",
  "",
  "        return res",
];
