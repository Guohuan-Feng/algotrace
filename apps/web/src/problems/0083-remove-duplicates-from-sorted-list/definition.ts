import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 83,
  title: "Remove Duplicates from Sorted List",
  cnTitle: "删除排序链表中的重复元素",
  slug: "remove-duplicates-from-sorted-list",
  difficulty: "Easy",
  tags: ["Linked List"],
  pattern: "Keep first node of each run",
  collections: ["Linked List"],
  hasVisualizer: true,
  summary: "Ready visualizer: compare each node with its neighbor and relink current.next whenever that neighbor is a duplicate.",
} satisfies ReadyProblemDefinition;
