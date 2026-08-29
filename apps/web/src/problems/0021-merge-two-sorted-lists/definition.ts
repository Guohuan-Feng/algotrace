import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 21,
  title: "Merge Two Sorted Lists",
  cnTitle: "合并两个有序链表",
  slug: "merge-two-sorted-lists",
  difficulty: "Easy",
  tags: ["Linked List", "Recursion"],
  pattern: "Pointer merge",
  collections: ["Hot 150"],
  hasVisualizer: true,
  summary: "Ready visualizer: compare both front nodes, attach the smaller one, then append the sorted remainder.",
} satisfies ReadyProblemDefinition;
