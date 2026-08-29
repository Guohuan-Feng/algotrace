export type PermutationsIiInput = { nums: number[] };

export type PermutationsIiExample = { id: 1 | 2; label: string; input: PermutationsIiInput; output: number[][] };

export const title = "47. Permutations II";

export const examples: PermutationsIiExample[] = [
  { id: 1, label: "LeetCode 1", input: { nums: [1, 1, 2] }, output: [[1, 1, 2], [1, 2, 1], [2, 1, 1]] },
  { id: 2, label: "LeetCode 2", input: { nums: [1, 2, 3] }, output: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] },
];

export const defaultExample = examples[0];

export const codeLines = [
  "class Solution:",
  "    def permuteUnique(self, nums: List[int]) -> List[List[int]]:",
  "        nums.sort()",
  "        res = []",
  "        used = [False] * len(nums)",
  "",
  "        def backtrack(path):",
  "            if len(path) == len(nums):",
  "                res.append(path)",
  "                return",
  "",
  "            for i in range(len(nums)):",
  "                if used[i]:",
  "                    continue",
  "",
  "                if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:",
  "                    continue",
  "",
  "                used[i] = True",
  "                backtrack(path + [nums[i]])",
  "                used[i] = False",
  "",
  "        backtrack([])",
  "",
  "        return res",
];
