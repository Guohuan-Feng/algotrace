import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 1631,
  "title": "Path With Minimum Effort",
  "cnTitle": "最小体力消耗路径",
  "slug": "path-with-minimum-effort",
  "difficulty": "Medium",
  "tags": [
    "Graph",
    "Dijkstra",
    "Matrix",
    "Heap",
    "Binary Search"
  ],
  "pattern": "Minimax path Dijkstra",
  "collections": [
    "Graph"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: relax paths by minimizing the maximum height difference."
} satisfies ReadyProblemDefinition;
