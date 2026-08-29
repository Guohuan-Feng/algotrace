export type SortColorsInput = { nums: number[] };

export const title = "75. Sort Colors";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { nums: [2, 0, 2, 1, 1, 0] }, output: [0, 0, 1, 1, 2, 2] },
  { id: 2, label: "LeetCode 2", input: { nums: [2, 0, 1] }, output: [0, 1, 2] },
] satisfies Array<{ id: number; label: string; input: SortColorsInput; output: number[] }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def sortColors(self, nums: List[int]) -> None:",
  "        low = mid = 0",
  "        high = len(nums) - 1",
  "",
  "        while mid <= high:",
  "            if nums[mid] == 0:",
  "                nums[low], nums[mid] = nums[mid], nums[low]",
  "                low += 1",
  "                mid += 1",
  "            elif nums[mid] == 1:",
  "                mid += 1",
  "            else:",
  "                nums[mid], nums[high] = nums[high], nums[mid]",
  "                high -= 1",
];
