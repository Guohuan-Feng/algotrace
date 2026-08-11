import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 417,
  "title": "Pacific Atlantic Water Flow",
  "cnTitle": "太平洋大西洋水流问题",
  "slug": "pacific-atlantic-water-flow",
  "difficulty": "Medium",
  "tags": [
    "DFS",
    "BFS",
    "Matrix"
  ],
  "pattern": "Reverse ocean DFS",
  "collections": [
    "Graph"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: search inward from both oceans and collect the reachability intersection."
} satisfies ReadyProblemDefinition;
