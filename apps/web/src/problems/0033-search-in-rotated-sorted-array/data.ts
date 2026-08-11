export type SearchRotatedExample = {
  id: 1 | 2 | 3;
  label: string;
  nums: number[];
  target: number;
  output: number;
};

export const title = "33. Search in Rotated Sorted Array";

export const examples: SearchRotatedExample[] = [
  { id: 1, label: "LeetCode 1", nums: [4, 5, 6, 7, 0, 1, 2], target: 0, output: 4 },
  { id: 2, label: "LeetCode 2", nums: [4, 5, 6, 7, 0, 1, 2], target: 3, output: -1 },
  { id: 3, label: "LeetCode 3", nums: [1], target: 0, output: -1 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def search(self, nums: List[int], target: int) -> int:",
  "        left = 0",
  "        right = len(nums) - 1",
  "",
  "        while left <= right:",
  "            mid = left + (right - left) // 2",
  "",
  "            if nums[mid] == target:",
  "                return mid",
  "",
  "            # 左半边有序",
  "            if nums[left] <= nums[mid]:",
  "                # target 在左半边范围内",
  "                if nums[left] <= target < nums[mid]:",
  "                    right = mid - 1",
  "                else:",
  "                    left = mid + 1",
  "",
  "            # 右半边有序",
  "            else:",
  "                # target 在右半边范围内",
  "                if nums[mid] < target <= nums[right]:",
  "                    left = mid + 1",
  "                else:",
  "                    right = mid - 1",
  "",
  "        return -1",
];
