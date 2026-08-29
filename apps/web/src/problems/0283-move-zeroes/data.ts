export type MoveZeroesInput = { nums: number[] };
export const title = "283. Move Zeroes";
export const examples = [{ id: 1, label: "LeetCode 1", input: { nums: [0, 1, 0, 3, 12] }, output: [1, 3, 12, 0, 0] }, { id: 2, label: "LeetCode 2", input: { nums: [0] }, output: [0] }] satisfies Array<{ id: number; label: string; input: MoveZeroesInput; output: number[] }>;
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def moveZeroes(self, nums: List[int]) -> None:", "        slow = 0", "", "        for fast in range(len(nums)):", "            if nums[fast] != 0:", "                nums[slow], nums[fast] = nums[fast], nums[slow]", "                slow += 1"];
