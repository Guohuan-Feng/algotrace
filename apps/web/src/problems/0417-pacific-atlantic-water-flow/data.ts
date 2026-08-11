export type PacificAtlanticExample = {
  id: 1 | 2;
  label: string;
  heights: number[][];
  output: number[][];
};

export const title = "417. Pacific Atlantic Water Flow";

export const examples: PacificAtlanticExample[] = [
  {
    id: 1,
    label: "LeetCode 1",
    heights: [
      [1, 2, 2, 3, 5],
      [3, 2, 3, 4, 4],
      [2, 4, 5, 3, 1],
      [6, 7, 1, 4, 5],
      [5, 1, 1, 2, 4],
    ],
    output: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]],
  },
  {
    id: 2,
    label: "LeetCode 2",
    heights: [[1]],
    output: [[0, 0]],
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "class Solution:",
  "    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:",
  "        m, n = len(heights), len(heights[0])",
  "",
  "        pacific = [[False] * n for _ in range(m)]",
  "        atlantic = [[False] * n for _ in range(m)]",
  "",
  "        def dfs(i, j, visited):",
  "            visited[i][j] = True",
  "",
  "            for di, dj in [(1,0), (-1,0), (0,1), (0,-1)]:",
  "                ni, nj = i + di, j + dj",
  "",
  "                if 0 <= ni < m and 0 <= nj < n:",
  "                    if visited[ni][nj] == False and heights[ni][nj] >= heights[i][j]:",
  "                        dfs(ni, nj, visited)",
  "",
  "",
  "        for i in range(m):",
  "            dfs(i, 0, pacific)",
  "            dfs(i, n-1, atlantic)",
  "",
  "        for j in range(n):",
  "            dfs(0, j, pacific)",
  "            dfs(m-1, j, atlantic)",
  "",
  "",
  "        ans = []",
  "",
  "        for i in range(m):",
  "            for j in range(n):",
  "                if pacific[i][j] and atlantic[i][j]:",
  "                    ans.append([i,j])",
  "",
  "        return ans",
];
