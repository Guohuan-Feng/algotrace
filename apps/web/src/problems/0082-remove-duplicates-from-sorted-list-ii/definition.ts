import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 82,
  title: "Remove Duplicates from Sorted List II",
  cnTitle: "删除排序链表中的重复元素 II",
  slug: "remove-duplicates-from-sorted-list-ii",
  difficulty: "Medium",
  tags: ["Linked List", "Two Pointers"],
  pattern: "Dummy node skips duplicate runs",
  collections: ["Hot 150", "Linked List"],
  hasVisualizer: true,
  summary: "Ready visualizer: keep a prev pointer before the candidate run and relink it past every value that occurs more than once.",
} satisfies ReadyProblemDefinition;
