export type NumberOfIslandsInput = { grid: string[][] };

export type NumberOfIslandsExample = {
  id: 1 | 2;
  label: string;
  input: NumberOfIslandsInput;
  output: number;
};

export const title = "200. Number of Islands";

export const examples: NumberOfIslandsExample[] = [
  { id: 1, label: "LeetCode 1", input: { grid: [["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]] }, output: 1 },
  { id: 2, label: "LeetCode 2", input: { grid: [["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]] }, output: 3 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "class Solution:",
  "    def numIslands(self, grid: List[List[str]]) -> int:",
  "        m, n = len(grid), len(grid[0])",
  "        count = 0",
  "",
  "        def dfs(i, j):",
  "            if i < 0 or i >= m or j < 0 or j >= n:",
  "                return",
  "",
  "            if grid[i][j] == \"0\":",
  "                return",
  "",
  "            grid[i][j] = \"0\"",
  "",
  "            dfs(i + 1, j)",
  "            dfs(i - 1, j)",
  "            dfs(i, j + 1)",
  "            dfs(i, j - 1)",
  "",
  "        for i in range(m):",
  "            for j in range(n):",
  "                if grid[i][j] == \"1\":",
  "                    count += 1",
  "                    dfs(i, j)",
  "",
  "        return count",
];
