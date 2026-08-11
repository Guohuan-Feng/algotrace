export type TriangleExample = {
  id: 1 | 2 | 3;
  label: string;
  triangle: number[][];
  output: number;
};

export const title = "120. Triangle";

export const examples: TriangleExample[] = [
  { id: 1, label: "LeetCode 1", triangle: [[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]], output: 11 },
  { id: 2, label: "LeetCode 2", triangle: [[-10]], output: -10 },
  { id: 3, label: "Practice", triangle: [[1], [2, 3], [3, 6, 1], [8, 4, 2, 5]], output: 7 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "from functools import lru_cache",
  "",
  "class Solution:",
  "    def minimumTotal(self, triangle: List[List[int]]) -> int:",
  "",
  "        @lru_cache(None)",
  "        def dfs(i, j):",
  "            if i == len(triangle) - 1:",
  "                return triangle[i][j]",
  "",
  "            left = dfs(i + 1, j)",
  "            right = dfs(i + 1, j + 1)",
  "",
  "            return triangle[i][j] + min(left, right)",
  "",
  "        return dfs(0, 0)",
];
