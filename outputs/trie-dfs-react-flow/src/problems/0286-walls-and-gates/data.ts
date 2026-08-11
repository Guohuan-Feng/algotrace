export type WallsAndGatesExample = {
  id: 1;
  label: string;
  rooms: number[][];
  output: number[][];
};

export const title = "286. Walls and Gates";

export const examples: WallsAndGatesExample[] = [
  {
    id: 1,
    label: "LeetCode 1",
    rooms: [
      [2147483647, -1, 0, 2147483647],
      [2147483647, 2147483647, 2147483647, -1],
      [2147483647, -1, 2147483647, -1],
      [0, -1, 2147483647, 2147483647],
    ],
    output: [
      [3, -1, 0, 1],
      [2, 2, 1, -1],
      [1, -1, 2, -1],
      [0, -1, 3, 4],
    ],
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from collections import deque",
  "",
  "class Solution:",
  "    def wallsAndGates(self, rooms: List[List[int]]) -> None:",
  "        if not rooms:",
  "            return",
  "",
  "        m, n = len(rooms), len(rooms[0])",
  "        queue = deque()",
  "",
  "        for i in range(m):",
  "            for j in range(n):",
  "                if rooms[i][j] == 0:",
  "                    queue.append((i, j))",
  "",
  "        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]",
  "",
  "        while queue:",
  "            i, j = queue.popleft()",
  "",
  "            for di, dj in directions:",
  "                ni, nj = i + di, j + dj",
  "",
  "                if 0 <= ni < m and 0 <= nj < n and rooms[ni][nj] == 2147483647:",
  "                    rooms[ni][nj] = rooms[i][j] + 1",
  "                    queue.append((ni, nj))",
];
