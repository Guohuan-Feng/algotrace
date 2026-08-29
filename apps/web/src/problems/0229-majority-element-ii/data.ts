export type MajorityElementIiInput = { nums: number[] };

export const title = "229. Majority Element II";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { nums: [3, 2, 3] }, output: [3] },
  { id: 2, label: "LeetCode 2", input: { nums: [1] }, output: [1] },
  { id: 3, label: "LeetCode 3", input: { nums: [1, 2] }, output: [1, 2] },
] satisfies Array<{ id: number; label: string; input: MajorityElementIiInput; output: number[] }>;
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def majorityElement(self, nums: List[int]) -> List[int]:",
  "        candidate1 = candidate2 = None",
  "        count1 = count2 = 0",
  "",
  "        for num in nums:",
  "            if num == candidate1:",
  "                count1 += 1",
  "            elif num == candidate2:",
  "                count2 += 1",
  "            elif count1 == 0:",
  "                candidate1, count1 = num, 1",
  "            elif count2 == 0:",
  "                candidate2, count2 = num, 1",
  "            else:",
  "                count1 -= 1",
  "                count2 -= 1",
  "",
  "        return [num for num in (candidate1, candidate2) if nums.count(num) > len(nums) // 3]",
];
