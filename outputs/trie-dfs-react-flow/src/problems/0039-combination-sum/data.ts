export type CombinationSumExample = {
  id: 1 | 2 | 3;
  label: string;
  candidates: number[];
  target: number;
  output: number[][];
};

export const title = "Combination Sum: Backtracking Visualizer";

export const examples: CombinationSumExample[] = [
  {
    id: 1,
    label: "Example 1",
    candidates: [2, 3, 6, 7],
    target: 7,
    output: [[2, 2, 3], [7]],
  },
  {
    id: 2,
    label: "Example 2",
    candidates: [2, 3, 5],
    target: 8,
    output: [[2, 2, 2, 2], [2, 3, 3], [3, 5]],
  },
  {
    id: 3,
    label: "Example 3",
    candidates: [2],
    target: 1,
    output: [],
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:",
  "        res = []",
  "",
  "        def backtrack(start, path, total):",
  "            # 如果当前和等于 target，说明找到一个答案",
  "            if total == target:",
  "                res.append(path)",
  "                return",
  "",
  "            # 如果当前和已经超过 target，没必要继续",
  "            if total > target:",
  "                return",
  "",
  "            for i in range(start, len(candidates)):",
  "                # 注意这里递归传 i，不是 i + 1",
  "                # 因为同一个数字可以重复使用",
  "                backtrack(i, path + [candidates[i]], total + candidates[i])",
  "",
  "        backtrack(0, [], 0)",
  "        return res",
];
