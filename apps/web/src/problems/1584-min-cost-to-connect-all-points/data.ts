export type MinCostConnectPointsExample = {
  id: 1 | 2;
  label: string;
  points: number[][];
  output: number;
};

export const title = "1584. Min Cost to Connect All Points";

export const examples: MinCostConnectPointsExample[] = [
  {
    id: 1,
    label: "LeetCode 1",
    points: [[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]],
    output: 20,
  },
  {
    id: 2,
    label: "LeetCode 2",
    points: [[3, 12], [-2, 5], [-4, 1]],
    output: 18,
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "import heapq",
  "",
  "",
  "class Solution:",
  "    def minCostConnectPoints(self, points: List[List[int]]) -> int:",
  "        n = len(points)",
  "",
  "        # (连接成本, 点的下标)",
  "        heap = [(0, 0)]",
  "",
  "        visited = set()",
  "        res = 0",
  "",
  "        while len(visited) < n:",
  "            # 取当前最便宜的连接方案",
  "            cost, cur = heapq.heappop(heap)",
  "",
  "            # 这个点已经加入 MST，跳过",
  "            if cur in visited:",
  "                continue",
  "",
  "            # 正式把 cur 加入 MST",
  "            visited.add(cur)",
  "            res += cost",
  "",
  "            x1, y1 = points[cur]",
  "",
  "            # 从 cur 尝试连接所有还没加入 MST 的点",
  "            for nei in range(n):",
  "                if nei not in visited:",
  "                    x2, y2 = points[nei]",
  "",
  "                    # 曼哈顿距离",
  "                    new_cost = abs(x1 - x2) + abs(y1 - y2)",
  "",
  "                    heapq.heappush(heap, (new_cost, nei))",
  "",
  "        return res",
];
