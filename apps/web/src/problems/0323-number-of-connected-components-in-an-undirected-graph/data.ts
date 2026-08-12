export type ConnectedComponentsExample = {
  id: 1 | 2 | 3;
  label: string;
  n: number;
  edges: number[][];
  output: number;
};

export const title = "323. Number of Connected Components in an Undirected Graph";

export const examples: ConnectedComponentsExample[] = [
  { id: 1, label: "LeetCode 1", n: 5, edges: [[0, 1], [1, 2], [3, 4]], output: 2 },
  { id: 2, label: "LeetCode 2", n: 5, edges: [[0, 1], [1, 2], [2, 3], [3, 4]], output: 1 },
  { id: 3, label: "Three groups", n: 6, edges: [[0, 1], [2, 3]], output: 4 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def countComponents(self, n: int, edges: List[List[int]]) -> int:",
  "        graph = [[] for _ in range(n)]",
  "",
  "        # Build an undirected graph",
  "        for a, b in edges:",
  "            graph[a].append(b)",
  "            graph[b].append(a)",
  "",
  "        visited = set()",
  "",
  "        def dfs(node):",
  "            visited.add(node)",
  "",
  "            for nei in graph[node]:",
  "                if nei not in visited:",
  "                    dfs(nei)",
  "",
  "        count = 0",
  "",
  "        for node in range(n):",
  "            # An unvisited node starts a new component",
  "            if node not in visited:",
  "                count += 1",
  "                dfs(node)",
  "",
  "        return count",
];
