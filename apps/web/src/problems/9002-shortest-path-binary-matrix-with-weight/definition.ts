import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 9002,
  "title": "Shortest Path Binary Matrix With Weight",
  "cnTitle": "带权二进制矩阵最短路",
  "slug": "shortest-path-binary-matrix-with-weight",
  "difficulty": "Medium",
  "tags": [
    "Graph",
    "Dijkstra",
    "Matrix",
    "Heap"
  ],
  "pattern": "Weighted grid Dijkstra",
  "collections": [
    "Amazon 真题"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: use a min heap to relax weighted 8-direction grid paths."
} satisfies ReadyProblemDefinition;
