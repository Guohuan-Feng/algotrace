import type { KSumExample, KSumInput } from "../../shared/kSum";

export const title = "15. 3Sum";
export const examples: KSumExample[] = [
  { id: 1, label: "LeetCode 1", input: { nums: [-1, 0, 1, 2, -1, -4] }, output: [[-1, -1, 2], [-1, 0, 1]] },
  { id: 2, label: "LeetCode 2", input: { nums: [0, 1, 1] }, output: [] },
  { id: 3, label: "LeetCode 3", input: { nums: [0, 0, 0] }, output: [[0, 0, 0]] },
];

export type ThreeSumInput = KSumInput;
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def threeSum(self, nums: List[int]) -> List[List[int]]:",
  "        res = []",
  "        nums.sort()",
  "",
  "        for i in range(len(nums) - 2):",
  "            if i > 0 and nums[i] == nums[i - 1]:",
  "                continue",
  "            left, right = i + 1, len(nums) - 1",
  "            while left < right:",
  "                total = nums[i] + nums[left] + nums[right]",
  "                if total < 0:",
  "                    left += 1",
  "                elif total > 0:",
  "                    right -= 1",
  "                else:",
  "                    res.append([nums[i], nums[left], nums[right]])",
  "                    left += 1",
  "                    right -= 1",
  "                    while left < right and nums[left] == nums[left - 1]:",
  "                        left += 1",
  "        return res",
];
