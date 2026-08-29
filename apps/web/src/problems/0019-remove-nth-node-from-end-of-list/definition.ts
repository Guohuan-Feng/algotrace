import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 19,
  title: "Remove Nth Node From End of List",
  cnTitle: "删除链表的倒数第 N 个结点",
  slug: "remove-nth-node-from-end-of-list",
  difficulty: "Medium",
  tags: ["Linked List", "Two Pointers"],
  pattern: "Gap pointer",
  collections: ["Hot 150"],
  hasVisualizer: true,
  summary: "Ready visualizer: move fast n + 1 steps ahead, advance both pointers, then bypass slow.next.",
} satisfies ReadyProblemDefinition;
