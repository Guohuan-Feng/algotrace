export type IslandPerimeterInput = { grid: number[][] };

export type IslandPerimeterExample = { id: 1 | 2; label: string; input: IslandPerimeterInput; output: number };

export const title = "463. Island Perimeter";

export const examples: IslandPerimeterExample[] = [
  { id: 1, label: "LeetCode 1", input: { grid: [[0, 1, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [1, 1, 0, 0]] }, output: 16 },
  { id: 2, label: "LeetCode 2", input: { grid: [[1]] }, output: 4 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "class Solution:",
  "    def islandPerimeter(self, grid: List[List[int]]) -> int:",
  "        m, n = len(grid), len(grid[0])",
  "",
  "        def dfs(i, j):",
  "            # 走出地图边界，说明这一条边是岛的边界",
  "            if i < 0 or i >= m or j < 0 or j >= n:",
  "                return 1",
  "",
  "            if grid[i][j] == 0:",
  "                return 1",
  "",
  "            if grid[i][j] == 2:",
  "                return 0",
  "",
  "            # 标记当前陆地已经访问，防止重复遍历",
  "            grid[i][j] = 2",
  "",
  "            return (",
  "                dfs(i + 1, j) +  # 下",
  "                dfs(i - 1, j) +  # 上",
  "                dfs(i, j + 1) +  # 右",
  "                dfs(i, j - 1)    # 左",
  "            )",
  "",
  "        for i in range(m):",
  "            for j in range(n):",
  "                if grid[i][j] == 1:",
  "                    return dfs(i, j)",
];
