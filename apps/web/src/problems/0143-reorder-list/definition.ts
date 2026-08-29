import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 143,
  title: "Reorder List",
  cnTitle: "重排链表",
  slug: "reorder-list",
  difficulty: "Medium",
  tags: ["Linked List", "Two Pointers", "Stack", "Recursion"],
  pattern: "Middle + reverse + merge",
  collections: ["Hot 150", "Linked List", "Two Pointers"],
  hasVisualizer: true,
  summary: "Ready visualizer: find the middle, reverse the suffix in place, then weave the two halves together.",
} satisfies ReadyProblemDefinition;
