import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 39,
  "title": "Combination Sum",
  "cnTitle": "组合总和",
  "slug": "combination-sum",
  "difficulty": "Medium",
  "tags": [
    "Array",
    "Backtracking"
  ],
  "pattern": "Reusable choice backtracking",
  "collections": [
    "Hot 150"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: reuse candidates, track total, and prune branches that exceed target."
} satisfies ReadyProblemDefinition;
