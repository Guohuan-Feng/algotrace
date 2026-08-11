import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 148,
  "title": "Sort List",
  "cnTitle": "排序链表",
  "slug": "sort-list",
  "difficulty": "Medium",
  "tags": [
    "Linked List",
    "Two Pointers",
    "Divide and Conquer",
    "Sorting"
  ],
  "pattern": "Merge sort linked list",
  "collections": [
    "Hot 150"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: split with slow/fast pointers, recursively sort, and merge linked lists."
} satisfies ReadyProblemDefinition;
