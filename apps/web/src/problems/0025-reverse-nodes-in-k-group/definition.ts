import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 25,
  title: "Reverse Nodes in k-Group",
  cnTitle: "K 个一组翻转链表",
  slug: "reverse-nodes-in-k-group",
  difficulty: "Hard",
  tags: ["Linked List", "Recursion"],
  pattern: "K-group pointer reversal",
  collections: ["Hot 150", "Linked List"],
  hasVisualizer: true,
  summary: "Ready visualizer: scan for each complete k-node group, then reverse its next pointers in place.",
} satisfies ReadyProblemDefinition;
