import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 286,
  "title": "Walls and Gates",
  "cnTitle": "墙与门",
  "slug": "walls-and-gates",
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
  "summary": "Ready visualizer: enqueue every gate, then fill each empty room with its nearest-gate distance."
} satisfies ReadyProblemDefinition;
