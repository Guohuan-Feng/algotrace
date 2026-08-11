import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 207,
  "title": "Course Schedule",
  "cnTitle": "课程表",
  "slug": "course-schedule",
  "difficulty": "Medium",
  "tags": [
    "Graph",
    "Topological Sort",
    "BFS",
    "DFS"
  ],
  "pattern": "DFS cycle detection",
  "collections": [
    "Hot 150"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: build prerequisite edges and use DFS three-color visited states to detect cycles."
} satisfies ReadyProblemDefinition;
