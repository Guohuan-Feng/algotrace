export type NextGreaterInput = { nums1: number[]; nums2: number[] };

export const title = "496. Next Greater Element I";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { nums1: [4, 1, 2], nums2: [1, 3, 4, 2] }, output: [-1, 3, -1] },
  { id: 2, label: "LeetCode 2", input: { nums1: [2, 4], nums2: [1, 2, 3, 4] }, output: [3, -1] },
] satisfies Array<{ id: number; label: string; input: NextGreaterInput; output: number[] }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def nextGreaterElement(self, nums1, nums2):",
  "        next_greater, stack = {}, []",
  "        for num in nums2:",
  "            while stack and stack[-1] < num:",
  "                next_greater[stack.pop()] = num",
  "            stack.append(num)",
  "        return [next_greater.get(num, -1) for num in nums1]",
];
