export type MajorityElementInput = { nums: number[] };

export const title = "169. Majority Element";

export const examples = [
  { id: 1, label: "LeetCode 1", input: { nums: [3, 2, 3] }, output: 3 },
  { id: 2, label: "LeetCode 2", input: { nums: [2, 2, 1, 1, 1, 2, 2] }, output: 2 },
] satisfies Array<{ id: number; label: string; input: MajorityElementInput; output: number }>;

export const defaultExample = examples[0]!;

export const codeLines = [
  "class Solution:",
  "    def majorityElement(self, nums: List[int]) -> int:",
  "        candidate = None",
  "        count = 0",
  "",
  "        for num in nums:",
  "            if count == 0:",
  "                candidate = num",
  "            count += 1 if num == candidate else -1",
  "",
  "        return candidate",
];
