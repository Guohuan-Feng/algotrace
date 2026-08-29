export type RemoveElementInput = { nums: number[]; val: number };

export const title = "27. Remove Element";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { nums: [3, 2, 2, 3], val: 3 }, output: { k: 2, nums: [2, 2] } },
  { id: 2, label: "LeetCode 2", input: { nums: [0, 1, 2, 2, 3, 0, 4, 2], val: 2 }, output: { k: 5, nums: [0, 1, 3, 0, 4] } },
] satisfies Array<{ id: number; label: string; input: RemoveElementInput; output: { k: number; nums: number[] } }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def removeElement(self, nums: List[int], val: int) -> int:",
  "        write = 0",
  "",
  "        for read in range(len(nums)):",
  "            if nums[read] != val:",
  "                nums[write] = nums[read]",
  "                write += 1",
  "",
  "        return write",
];
