export type RedundantConnectionExample = {
  id: 1 | 2;
  label: string;
  edges: number[][];
  output: [number, number];
};

export const title = "684. Redundant Connection";

export const examples: RedundantConnectionExample[] = [
  { id: 1, label: "LeetCode 1", edges: [[1, 2], [1, 3], [2, 3]], output: [2, 3] },
  { id: 2, label: "LeetCode 2", edges: [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]], output: [1, 4] },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:",
  "        n = len(edges)",
  "        parent = list(range(n + 1))",
  "",
  "        def find(x):",
  "            if parent[x] != x:",
  "                parent[x] = find(parent[x])",
  "            return parent[x]",
  "",
  "        for a, b in edges:",
  "            pa, pb = find(a), find(b)",
  "",
  "            if pa == pb:",
  "                return [a, b]",
  "",
  "            parent[pa] = pb",
];
