export type CombinationsExample = {
  id: 1 | 2;
  label: string;
  n: number;
  k: number;
  output: number[][];
};

export const title = "Combinations: Backtracking Visualizer";

export const examples: CombinationsExample[] = [
  {
    id: 1,
    label: "Example 1",
    n: 4,
    k: 2,
    output: [
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
      [3, 4],
    ],
  },
  {
    id: 2,
    label: "Example 2",
    n: 1,
    k: 1,
    output: [[1]],
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def combine(self, n: int, k: int) -> List[List[int]]:",
  "        res = []",
  "",
  "        def backtrack(start, path):",
  "            if len(path) == k:",
  "                res.append(path)",
  "                return",
  "",
  "            for i in range(start, n + 1):",
  "                backtrack(i + 1, path + [i])",
  "",
  "        backtrack(1, [])",
  "        return res",
];
