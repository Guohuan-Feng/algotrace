import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 153,
  "title": "Find Minimum in Rotated Sorted Array",
  "cnTitle": "寻找旋转排序数组中的最小值",
  "slug": "find-minimum-in-rotated-sorted-array",
  "difficulty": "Medium",
  "tags": [
    "Array",
    "Binary Search"
  ],
  "pattern": "Rotated minimum search",
  "collections": [
    "Hot 150"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: compare mid with right and shrink the rotated search window until the minimum remains."
} satisfies ReadyProblemDefinition;
