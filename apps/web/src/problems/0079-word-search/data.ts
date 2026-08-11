export type WordSearchExistExample = {
  id: 1 | 2 | 3;
  label: string;
  board: string[][];
  word: string;
  output: boolean;
};

export const title = "Word Search: Grid DFS Visualizer";

export const examples: WordSearchExistExample[] = [
  {
    id: 1,
    label: "Example 1",
    board: [
      ["A", "B", "C", "E"],
      ["S", "F", "C", "S"],
      ["A", "D", "E", "E"],
    ],
    word: "ABCCED",
    output: true,
  },
  {
    id: 2,
    label: "Example 2",
    board: [
      ["A", "B", "C", "E"],
      ["S", "F", "C", "S"],
      ["A", "D", "E", "E"],
    ],
    word: "SEE",
    output: true,
  },
  {
    id: 3,
    label: "Example 3",
    board: [
      ["A", "B", "C", "E"],
      ["S", "F", "C", "S"],
      ["A", "D", "E", "E"],
    ],
    word: "ABCB",
    output: false,
  },
];

export const defaultExample = examples[0];

export const directions = [
  [1, 0, "down", 25],
  [-1, 0, "up", 26],
  [0, 1, "right", 27],
  [0, -1, "left", 28],
] as const;

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def exist(self, board: List[List[str]], word: str) -> bool:",
  "        m = len(board)",
  "        n = len(board[0])",
  "",
  "        visited = [[False] * n for _ in range(m)]",
  "",
  "        def dfs(i, j, index):",
  "            if index == len(word):",
  "                return True",
  "",
  "            if i < 0 or i >= m or j < 0 or j >= n:",
  "                return False",
  "",
  "            if visited[i][j]:",
  "                return False",
  "",
  "            if board[i][j] != word[index]:",
  "                return False",
  "",
  "            visited[i][j] = True",
  "",
  "            found = (",
  "                dfs(i + 1, j, index + 1) or",
  "                dfs(i - 1, j, index + 1) or",
  "                dfs(i, j + 1, index + 1) or",
  "                dfs(i, j - 1, index + 1)",
  "            )",
  "",
  "            visited[i][j] = False",
  "",
  "            return found",
  "",
  "        for i in range(m):",
  "            for j in range(n):",
  "                if dfs(i, j, 0):",
  "                    return True",
  "",
  "        return False",
];
