export type MergeSortedArrayInput = { nums1: number[]; m: number; nums2: number[]; n: number };

export const title = "88. Merge Sorted Array";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { nums1: [1, 2, 3, 0, 0, 0], m: 3, nums2: [2, 5, 6], n: 3 }, output: [1, 2, 2, 3, 5, 6] },
  { id: 2, label: "LeetCode 2", input: { nums1: [1], m: 1, nums2: [], n: 0 }, output: [1] },
  { id: 3, label: "LeetCode 3", input: { nums1: [0], m: 0, nums2: [1], n: 1 }, output: [1] },
] satisfies Array<{ id: number; label: string; input: MergeSortedArrayInput; output: number[] }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:",
  "        p1, p2, write = m - 1, n - 1, m + n - 1",
  "",
  "        while p2 >= 0:",
  "            if p1 >= 0 and nums1[p1] > nums2[p2]:",
  "                nums1[write] = nums1[p1]",
  "                p1 -= 1",
  "            else:",
  "                nums1[write] = nums2[p2]",
  "                p2 -= 1",
  "            write -= 1",
];
