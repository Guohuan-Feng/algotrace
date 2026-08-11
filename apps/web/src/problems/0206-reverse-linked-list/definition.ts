import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 206,
  "title": "Reverse Linked List",
  "cnTitle": "反转链表",
  "slug": "reverse-linked-list",
  "difficulty": "Easy",
  "tags": [
    "Linked List",
    "Recursion"
  ],
  "pattern": "Iterative pointer reversal",
  "collections": [
    "Linked List"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: move cur through the list while redirecting each next pointer back to prev."
} satisfies ReadyProblemDefinition;
