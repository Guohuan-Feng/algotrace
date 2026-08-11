export type FindMinimumRotatedExample = {
  id: 1 | 2 | 3;
  label: string;
  nums: number[];
  output: number;
};

export const title = "153. Find Minimum in Rotated Sorted Array";

export const examples: FindMinimumRotatedExample[] = [
  { id: 1, label: "LeetCode 1", nums: [3, 4, 5, 1, 2], output: 1 },
  { id: 2, label: "LeetCode 2", nums: [4, 5, 6, 7, 0, 1, 2], output: 0 },
  { id: 3, label: "LeetCode 3", nums: [11, 13, 15, 17], output: 11 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def findMin(self, nums: List[int]) -> int:",
  "        left = 0",
  "        right = len(nums) - 1",
  "",
  "        while left < right:",
  "            mid = left + (right - left) // 2",
  "",
  "            if nums[mid] > nums[right]:",
  "                # mid 在左边较大的那段",
  "                # 最小值一定在 mid 右边",
  "                left = mid + 1",
  "            else:",
  "                # nums[mid] <= nums[right]",
  "                # mid 可能就是最小值",
  "                # 最小值在左边，包括 mid",
  "                right = mid",
  "",
  "        return nums[left]",
];
