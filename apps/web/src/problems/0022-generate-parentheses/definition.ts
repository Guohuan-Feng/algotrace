import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 22,
  "title": "Generate Parentheses",
  "cnTitle": "括号生成",
  "slug": "generate-parentheses",
  "difficulty": "Medium",
  "tags": [
    "String",
    "Dynamic Programming",
    "Backtracking"
  ],
  "pattern": "Backtracking constraints",
  "collections": [
    "Hot 150"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: grow valid parentheses strings while tracking left/right constraints."
} satisfies ReadyProblemDefinition;
