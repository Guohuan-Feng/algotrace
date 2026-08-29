import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 92,
  title: "Reverse Linked List II",
  cnTitle: "反转链表 II",
  slug: "reverse-linked-list-ii",
  difficulty: "Medium",
  tags: ["Linked List"],
  pattern: "In-place sublist head insertion",
  collections: ["Linked List"],
  hasVisualizer: true,
  summary: "Ready visualizer: keep prev before the chosen interval and repeatedly extract current.next to insert it at the interval front.",
} satisfies ReadyProblemDefinition;
