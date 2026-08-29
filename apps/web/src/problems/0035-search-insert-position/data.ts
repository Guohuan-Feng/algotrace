export type SearchInsertInput = { nums: number[]; target: number };

export const title = "35. Search Insert Position";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { nums: [1, 3, 5, 6], target: 5 }, output: 2 },
  { id: 2, label: "LeetCode 2", input: { nums: [1, 3, 5, 6], target: 2 }, output: 1 },
  { id: 3, label: "LeetCode 3", input: { nums: [1, 3, 5, 6], target: 7 }, output: 4 },
] satisfies Array<{ id: number; label: string; input: SearchInsertInput; output: number }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def searchInsert(self, nums: List[int], target: int) -> int:",
  "        left, right = 0, len(nums) - 1",
  "",
  "        while left <= right:",
  "            mid = left + (right - left) // 2",
  "            if nums[mid] == target:",
  "                return mid",
  "            if nums[mid] < target:",
  "                left = mid + 1",
  "            else:",
  "                right = mid - 1",
  "",
  "        return left",
];
