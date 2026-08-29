export type RotateArrayInput = { nums: number[]; k: number };

export const title = "189. Rotate Array";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { nums: [1, 2, 3, 4, 5, 6, 7], k: 3 }, output: [5, 6, 7, 1, 2, 3, 4] },
  { id: 2, label: "LeetCode 2", input: { nums: [-1, -100, 3, 99], k: 2 }, output: [3, 99, -1, -100] },
] satisfies Array<{ id: number; label: string; input: RotateArrayInput; output: number[] }>;
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def rotate(self, nums: List[int], k: int) -> None:",
  "        k %= len(nums)",
  "",
  "        def reverse(left, right):",
  "            while left < right:",
  "                nums[left], nums[right] = nums[right], nums[left]",
  "                left += 1",
  "                right -= 1",
  "",
  "        reverse(0, len(nums) - 1)",
  "        reverse(0, k - 1)",
  "        reverse(k, len(nums) - 1)",
];
