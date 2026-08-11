import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 994,
  "title": "Rotting Oranges",
  "cnTitle": "腐烂的橘子",
  "slug": "rotting-oranges",
  "difficulty": "Medium",
  "tags": [
    "BFS",
    "Matrix",
    "Queue"
  ],
  "pattern": "Multi-source BFS",
  "collections": [
    "Graph"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: spread rot one complete BFS level per minute."
} satisfies ReadyProblemDefinition;
