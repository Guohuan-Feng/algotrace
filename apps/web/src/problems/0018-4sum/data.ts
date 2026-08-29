import type { KSumExample, KSumInput } from "../../shared/kSum";

export const title = "18. 4Sum";
export const examples: KSumExample[] = [
  { id: 1, label: "LeetCode 1", input: { nums: [1, 0, -1, 0, -2, 2], target: 0 }, output: [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]] },
  { id: 2, label: "LeetCode 2", input: { nums: [2, 2, 2, 2, 2], target: 8 }, output: [[2, 2, 2, 2]] },
];

export type FourSumInput = KSumInput;
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def fourSum(self, nums: List[int], target: int) -> List[List[int]]:",
  "        nums.sort()",
  "        res = []",
  "",
  "        for i in range(len(nums) - 3):",
  "            if i > 0 and nums[i] == nums[i - 1]:",
  "                continue",
  "            for j in range(i + 1, len(nums) - 2):",
  "                if j > i + 1 and nums[j] == nums[j - 1]:",
  "                    continue",
  "                left, right = j + 1, len(nums) - 1",
  "                while left < right:",
  "                    total = nums[i] + nums[j] + nums[left] + nums[right]",
  "                    if total < target:",
  "                        left += 1",
  "                    elif total > target:",
  "                        right -= 1",
  "                    else:",
  "                        res.append([nums[i], nums[j], nums[left], nums[right]])",
  "                        left += 1",
  "                        right -= 1",
  "                        while left < right and nums[left] == nums[left - 1]:",
  "                            left += 1",
  "        return res",
];
