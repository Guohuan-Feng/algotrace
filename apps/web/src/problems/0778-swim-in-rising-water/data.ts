export type SwimInWaterExample = {
  id: 1 | 2 | 3;
  label: string;
  grid: number[][];
  output: number;
};

export const title = "778. Swim in Rising Water";

export const examples: SwimInWaterExample[] = [
  { id: 1, label: "LeetCode 1", grid: [[0, 2], [1, 3]], output: 3 },
  {
    id: 2,
    label: "LeetCode 2",
    grid: [[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]],
    output: 16,
  },
  { id: 3, label: "LeetCode 3", grid: [[0, 1, 2], [5, 4, 3], [6, 7, 8]], output: 8 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "import heapq",
  "",
  "",
  "class Solution:",
  "    def swimInWater(self, grid: List[List[int]]) -> int:",
  "        n = len(grid)",
  "",
  "        # (到达当前位置所需要的最小水位, row, col)",
  "        heap = [(grid[0][0], 0, 0)]",
  "",
  "        visited = set()",
  "",
  "        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]",
  "",
  "        while heap:",
  "            time, r, c = heapq.heappop(heap)",
  "",
  "            if (r, c) in visited:",
  "                continue",
  "",
  "            visited.add((r, c))",
  "",
  "            # 到达右下角",
  "            if r == n - 1 and c == n - 1:",
  "                return time",
  "",
  "            for dr, dc in directions:",
  "                nr = r + dr",
  "                nc = c + dc",
  "",
  "                if (",
  "                    0 <= nr < n",
  "                    and 0 <= nc < n",
  "                    and (nr, nc) not in visited",
  "                ):",
  "                    # 当前路径需要的水位 = 路径上最大高度",
  "                    new_time = max(time, grid[nr][nc])",
  "",
  "                    heapq.heappush(heap, (new_time, nr, nc))",
];
