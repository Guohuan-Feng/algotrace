export type WeightedGridExample = { id: 1 | 2 | 3; label: string; grid: number[][]; output: number };

export const title = "Amazon: Weighted Binary Matrix Shortest Path";

export const examples: WeightedGridExample[] = [
  { id: 1, label: "Weighted path", grid: [[1, 3, 2, 4], [2, -1, 5, 1], [4, 2, 1, 3], [6, 3, 2, 1]], output: 7 },
  { id: 2, label: "Obstacle detour", grid: [[1, 8, 2, 5], [3, -1, -1, 2], [4, 1, 6, 1], [7, 2, 1, 2]], output: 8 },
  { id: 3, label: "No path", grid: [[1, -1, 2, 3], [-1, -1, -1, 4], [2, -1, 1, 2], [3, 2, 1, 1]], output: -1 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "import heapq",
  "class Solution:",
  "    def shortestPathBinaryMatrixWithWeight(self, grid):",
  "        n = len(grid)",
  "        if grid[0][0] == -1 or grid[n - 1][n - 1] == -1:",
  "            return -1",
  "        directions = [eight directions]",
  "        dist = [[float(\"inf\")] * n for _ in range(n)]",
  "        dist[0][0] = grid[0][0]",
  "        heap = []",
  "        heapq.heappush(heap, (grid[0][0], 0, 0))",
  "        while heap:",
  "            cost, row, col = heapq.heappop(heap)",
  "            if cost > dist[row][col]:",
  "                continue",
  "            if row == n - 1 and col == n - 1:",
  "                return cost",
  "            for dr, dc in directions:",
  "                new_row = row + dr",
  "                new_col = col + dc",
  "                if inside and grid[new_row][new_col] != -1:",
  "                    new_cost = cost + grid[new_row][new_col]",
  "                    if new_cost < dist[new_row][new_col]:",
  "                        dist[new_row][new_col] = new_cost",
  "                        heapq.heappush(heap, (new_cost, new_row, new_col))",
  "        return -1",
];
