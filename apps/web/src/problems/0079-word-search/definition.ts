import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 79,
  "title": "Word Search",
  "cnTitle": "单词搜索",
  "slug": "word-search",
  "difficulty": "Medium",
  "tags": [
    "Array",
    "Backtracking",
    "Matrix"
  ],
  "pattern": "Grid DFS",
  "collections": [
    "Hot 150"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: trace grid DFS, visited cells, pruning, and backtracking."
} satisfies ReadyProblemDefinition;
