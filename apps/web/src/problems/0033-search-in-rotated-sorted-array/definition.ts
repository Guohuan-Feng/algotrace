import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 33,
  "title": "Search in Rotated Sorted Array",
  "cnTitle": "搜索旋转排序数组",
  "slug": "search-in-rotated-sorted-array",
  "difficulty": "Medium",
  "tags": [
    "Array",
    "Binary Search"
  ],
  "pattern": "Modified binary search",
  "collections": [
    "Hot 150"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: move left, mid, and right while detecting which half is sorted."
} satisfies ReadyProblemDefinition;
