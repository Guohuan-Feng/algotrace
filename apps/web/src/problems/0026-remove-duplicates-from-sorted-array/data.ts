export type RemoveDuplicatesSortedArrayExample = {
  id: 1 | 2;
  label: string;
  nums: number[];
  output: {
    k: number;
    nums: number[];
  };
};

export const title = "26. Remove Duplicates from Sorted Array";

export const examples: RemoveDuplicatesSortedArrayExample[] = [
  { id: 1, label: "LeetCode 1", nums: [1, 1, 2], output: { k: 2, nums: [1, 2] } },
  { id: 2, label: "LeetCode 2", nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4], output: { k: 5, nums: [0, 1, 2, 3, 4] } },
];

export const defaultExample = examples[0];

export const codeLines = [
  "class Solution:",
  "    def removeDuplicates(self, nums: List[int]) -> int:",
  "        slow = 1",
  "",
  "        for fast in range(1, len(nums)):",
  "            if nums[fast] != nums[fast - 1]:",
  "                nums[slow] = nums[fast]",
  "                slow += 1",
  "",
  "        return slow",
];
