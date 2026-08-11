import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 9001,
  "title": "Quick Sort",
  "cnTitle": "快速排序",
  "slug": "quick-sort",
  "difficulty": "Medium",
  "tags": [
    "Array",
    "Sorting",
    "Divide and Conquer",
    "Two Pointers"
  ],
  "pattern": "Partition quicksort",
  "collections": [
    "Sorting"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: partition around a pivot, move i/j pointers, swap, and recurse."
} satisfies ReadyProblemDefinition;
