export type SurroundedRegionsExample = {
  id: 1 | 2;
  label: string;
  board: string[][];
  output: string[][];
};

export const title = "130. Surrounded Regions";

export const examples: SurroundedRegionsExample[] = [
  {
    id: 1,
    label: "LeetCode 1",
    board: [
      ["X", "X", "X", "X"],
      ["X", "O", "O", "X"],
      ["X", "X", "O", "X"],
      ["X", "O", "X", "X"],
    ],
    output: [
      ["X", "X", "X", "X"],
      ["X", "X", "X", "X"],
      ["X", "X", "X", "X"],
      ["X", "O", "X", "X"],
    ],
  },
  {
    id: 2,
    label: "LeetCode 2",
    board: [["X"]],
    output: [["X"]],
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def solve(self, board: List[List[str]]) -> None:",
  "        m, n = len(board), len(board[0])",
  "",
  "        def dfs(i, j):",
  "            if 0 <= i < m and 0 <= j < n and board[i][j] == 'O':",
  "                board[i][j] = 'T'",
  "",
  "                dfs(i + 1, j)",
  "                dfs(i - 1, j)",
  "                dfs(i, j + 1)",
  "                dfs(i, j - 1)",
  "",
  "        for i in range(m):",
  "            dfs(i, 0)",
  "            dfs(i, n - 1)",
  "",
  "        for j in range(n):",
  "            dfs(0, j)",
  "            dfs(m - 1, j)",
  "",
  "        for i in range(m):",
  "            for j in range(n):",
  "                if board[i][j] == 'O':",
  "                    board[i][j] = 'X'",
  "",
  "                elif board[i][j] == 'T':",
  "                    board[i][j] = 'O'",
];
