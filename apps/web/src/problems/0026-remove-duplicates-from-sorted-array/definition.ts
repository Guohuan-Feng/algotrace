import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 26,
  "title": "Remove Duplicates from Sorted Array",
  "cnTitle": "删除有序数组中的重复项",
  "slug": "remove-duplicates-from-sorted-array",
  "difficulty": "Easy",
  "tags": [
    "Array",
    "Two Pointers"
  ],
  "pattern": "In-place write pointer",
  "collections": [
    "Hot 150"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: scan with fast, write each new unique value at slow, and return the valid prefix length."
} satisfies ReadyProblemDefinition;
