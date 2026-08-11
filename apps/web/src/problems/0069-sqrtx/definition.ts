import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 69,
  "title": "Sqrt(x)",
  "cnTitle": "x 的平方根",
  "slug": "sqrtx",
  "difficulty": "Easy",
  "tags": [
    "Math",
    "Binary Search"
  ],
  "pattern": "Binary boundary",
  "collections": [
    "Hot 150"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: move left/right until they cross, showing right as the last n where n^2 <= x and left as the first n where n^2 > x."
} satisfies ReadyProblemDefinition;
