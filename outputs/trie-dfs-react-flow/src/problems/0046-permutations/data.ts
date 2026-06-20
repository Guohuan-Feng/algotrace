export type PermutationsExample = {
  id: 1 | 2 | 3;
  label: string;
  nums: number[];
  output: number[][];
};

export const title = "Permutations: Backtracking Visualizer";

export const examples: PermutationsExample[] = [
  {
    id: 1,
    label: "Example 1",
    nums: [1, 2, 3],
    output: [
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1],
    ],
  },
  {
    id: 2,
    label: "Example 2",
    nums: [0, 1],
    output: [
      [0, 1],
      [1, 0],
    ],
  },
  {
    id: 3,
    label: "Example 3",
    nums: [1],
    output: [[1]],
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def permute(self, nums: List[int]) -> List[List[int]]:",
  "        res = []",
  "",
  "        def backtrack(path):",
  "            # 如果 path 长度等于 nums，说明一个排列完成",
  "            if len(path) == len(nums):",
  "                res.append(path)",
  "                return",
  "",
  "            # 每一层都从 nums 里面重新选",
  "            for num in nums:",
  "                # 如果这个数字已经在 path 里，说明用过了，跳过",
  "                if num in path:",
  "                    continue",
  "",
  "                # path + [num] 会生成一个新的列表",
  "                backtrack(path + [num])",
  "",
  "        backtrack([])",
  "        return res",
];
