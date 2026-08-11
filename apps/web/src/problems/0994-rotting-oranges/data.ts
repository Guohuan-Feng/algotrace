export type RottingOrangesExample = {
  id: 1 | 2 | 3;
  label: string;
  grid: number[][];
  output: number;
};

export const title = "994. Rotting Oranges";

export const examples: RottingOrangesExample[] = [
  {
    id: 1,
    label: "LeetCode 1",
    grid: [[2, 1, 1], [1, 1, 0], [0, 1, 1]],
    output: 4,
  },
  {
    id: 2,
    label: "LeetCode 2",
    grid: [[2, 1, 1], [0, 1, 1], [1, 0, 1]],
    output: -1,
  },
  {
    id: 3,
    label: "LeetCode 3",
    grid: [[0, 2]],
    output: 0,
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from collections import deque",
  "",
  "class Solution:",
  "    def orangesRotting(self, grid: List[List[int]]) -> int:",
  "        m, n = len(grid), len(grid[0])",
  "        queue = deque()",
  "        fresh = 0",
  "",
  "        for i in range(m):",
  "            for j in range(n):",
  "                if grid[i][j] == 2:",
  "                    queue.append((i, j))",
  "                elif grid[i][j] == 1:",
  "                    fresh += 1",
  "",
  "        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]",
  "        minutes = 0",
  "",
  "        while queue and fresh:",
  "            for _ in range(len(queue)):",
  "                i, j = queue.popleft()",
  "",
  "                for di, dj in directions:",
  "                    ni, nj = i + di, j + dj",
  "",
  "                    if 0 <= ni < m and 0 <= nj < n and grid[ni][nj] == 1:",
  "                        grid[ni][nj] = 2",
  "                        fresh -= 1",
  "                        queue.append((ni, nj))",
  "",
  "            minutes += 1",
  "",
  "        return minutes if fresh == 0 else -1",
];
