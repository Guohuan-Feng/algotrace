export type TwoSumInput = { nums: number[]; target: number };

export const title = "1. Two Sum";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
  { id: 2, label: "LeetCode 2", input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
  { id: 3, label: "LeetCode 3", input: { nums: [3, 3], target: 6 }, output: [0, 1] },
] satisfies Array<{ id: number; label: string; input: TwoSumInput; output: number[] }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def twoSum(self, nums, target):",
  "        seen = {}",
  "        for index, value in enumerate(nums):",
  "            complement = target - value",
  "            if complement in seen:",
  "                return [seen[complement], index]",
  "            seen[value] = index",
];
