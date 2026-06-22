export type MinimumEffortExample = { id: 1 | 2 | 3; label: string; heights: number[][]; output: number };

export const title = "Path With Minimum Effort: Dijkstra Visualizer";

export const examples: MinimumEffortExample[] = [
  { id: 1, label: "Example 1", heights: [[1, 2, 2], [3, 8, 2], [5, 3, 5]], output: 2 },
  { id: 2, label: "Example 2", heights: [[1, 2, 3], [3, 8, 4], [5, 3, 5]], output: 1 },
  { id: 3, label: "Example 3", heights: [[1, 2, 1, 1, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 1, 1, 2, 1]], output: 0 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "import heapq",
  "class Solution:",
  "    def minimumEffortPath(self, heights):",
  "        rows = len(heights)",
  "        cols = len(heights[0])",
  "        directions = [up, down, left, right]",
  "        dist = [[float(\"inf\")] * cols for _ in range(rows)]",
  "        dist[0][0] = 0",
  "        heap = []",
  "        heapq.heappush(heap, (0, 0, 0))",
  "        while heap:",
  "            effort, row, col = heapq.heappop(heap)",
  "            if effort > dist[row][col]:",
  "                continue",
  "            if row == rows - 1 and col == cols - 1:",
  "                return effort",
  "            for dr, dc in directions:",
  "                new_row = row + dr",
  "                new_col = col + dc",
  "                if 0 <= new_row < rows and 0 <= new_col < cols:",
  "                    diff = abs(heights[new_row][new_col] - heights[row][col])",
  "                    new_effort = max(effort, diff)",
  "                    if new_effort < dist[new_row][new_col]:",
  "                        dist[new_row][new_col] = new_effort",
  "                        heapq.heappush(heap, (new_effort, new_row, new_col))",
  "        return 0",
];
