export type GraphValidTreeExample = {
  id: 1 | 2 | 3;
  label: string;
  n: number;
  edges: number[][];
  output: boolean;
};

export const title = "261. Graph Valid Tree";

export const examples: GraphValidTreeExample[] = [
  {
    id: 1,
    label: "LeetCode 1",
    n: 5,
    edges: [[0, 1], [0, 2], [0, 3], [1, 4]],
    output: true,
  },
  {
    id: 2,
    label: "LeetCode 2",
    n: 5,
    edges: [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]],
    output: false,
  },
  {
    id: 3,
    label: "Disconnected",
    n: 4,
    edges: [[0, 1], [2, 3]],
    output: false,
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def validTree(self, n: int, edges: List[List[int]]) -> bool:",
  "        graph = [[] for _ in range(n)]",
  "",
  "        for a, b in edges:",
  "            graph[a].append(b)",
  "            graph[b].append(a)",
  "",
  "        visited = set()",
  "",
  "        def dfs(node, parent):",
  "            if node in visited:",
  "                return False",
  "",
  "            visited.add(node)",
  "",
  "            for nei in graph[node]:",
  "                if nei == parent:",
  "                    continue",
  "",
  "                if dfs(nei, node) == False:",
  "                    return False",
  "",
  "            return True",
  "",
  "        if dfs(0, -1) == False:",
  "            return False",
  "",
  "        return len(visited) == n",
];
