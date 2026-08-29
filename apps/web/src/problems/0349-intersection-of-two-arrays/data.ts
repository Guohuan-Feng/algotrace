export type IntersectionInput = { nums1: number[]; nums2: number[] };
export type IntersectionExample = { id: number; label: string; input: IntersectionInput; output: number[] };
export const title = "349. Intersection of Two Arrays";
export const examples: IntersectionExample[] = [
  { id: 1, label: "LeetCode 1", input: { nums1: [1, 2, 2, 1], nums2: [2, 2] }, output: [2] },
  { id: 2, label: "LeetCode 2", input: { nums1: [4, 9, 5], nums2: [9, 4, 9, 8, 4] }, output: [4, 9] },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def intersection(self, nums1: List[int], nums2: List[int]) -> List[int]:",
  "        seen = set(nums1)",
  "        result = set()",
  "",
  "        for num in nums2:",
  "            if num in seen:",
  "                result.add(num)",
  "",
  "        return list(result)",
];
