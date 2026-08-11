import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 120,
  "title": "Triangle",
  "cnTitle": "三角形最小路径和",
  "slug": "triangle",
  "difficulty": "Medium",
  "tags": [
    "Array",
    "Dynamic Programming"
  ],
  "pattern": "Memoized DFS",
  "collections": [
    "Hot 150"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: recurse to left and right children, cache each dfs(i,j), and return the minimum path sum."
} satisfies ReadyProblemDefinition;
