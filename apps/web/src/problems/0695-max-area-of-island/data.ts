export type MaxAreaOfIslandInput = { grid: number[][] };

export type MaxAreaOfIslandExample = {
  id: 1 | 2;
  label: string;
  input: MaxAreaOfIslandInput;
  output: number;
};

export const title = "695. Max Area of Island";

export const examples: MaxAreaOfIslandExample[] = [
  {
    id: 1,
    label: "LeetCode 1",
    input: { grid: [[0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]] },
    output: 6,
  },
  { id: 2, label: "LeetCode 2", input: { grid: [[0, 0, 0, 0, 0, 0, 0, 0]] }, output: 0 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "class Solution:",
  "    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:",
  "        m, n = len(grid), len(grid[0])",
  "        ans = 0",
  "",
  "        def dfs(i, j):",
  "            if i < 0 or i >= m or j < 0 or j >= n:",
  "                return 0",
  "",
  "            if grid[i][j] == 0:",
  "                return 0",
  "",
  "            grid[i][j] = 0",
  "",
  "            return (",
  "                1 +",
  "                dfs(i + 1, j) +",
  "                dfs(i - 1, j) +",
  "                dfs(i, j + 1) +",
  "                dfs(i, j - 1)",
  "            )",
  "",
  "        for i in range(m):",
  "            for j in range(n):",
  "                if grid[i][j] == 1:",
  "                    ans = max(ans, dfs(i, j))",
  "",
  "        return ans",
];
