export type RotatedSearchIiInput = { nums: number[]; target: number };

export const title = "81. Search in Rotated Sorted Array II";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { nums: [2, 5, 6, 0, 0, 1, 2], target: 0 }, output: true },
  { id: 2, label: "LeetCode 2", input: { nums: [2, 5, 6, 0, 0, 1, 2], target: 3 }, output: false },
] satisfies Array<{ id: number; label: string; input: RotatedSearchIiInput; output: boolean }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def search(self, nums: List[int], target: int) -> bool:",
  "        left, right = 0, len(nums) - 1",
  "",
  "        while left <= right:",
  "            mid = left + (right - left) // 2",
  "            if nums[mid] == target:",
  "                return True",
  "",
  "            if nums[left] == nums[mid] == nums[right]:",
  "                left += 1",
  "                right -= 1",
  "",
  "            elif nums[left] <= nums[mid]:",
  "                if nums[left] <= target < nums[mid]:",
  "                    right = mid - 1",
  "                else:",
  "                    left = mid + 1",
  "            else:",
  "                if nums[mid] < target <= nums[right]:",
  "                    left = mid + 1",
  "                else:",
  "                    right = mid - 1",
  "",
  "        return False",
];
