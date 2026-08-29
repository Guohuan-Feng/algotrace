import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 203,
  title: "Remove Linked List Elements",
  cnTitle: "移除链表元素",
  slug: "remove-linked-list-elements",
  difficulty: "Easy",
  tags: ["Linked List", "Recursion"],
  pattern: "Dummy node and bypass",
  collections: ["Linked List"],
  hasVisualizer: true,
  summary: "Ready visualizer: use dummy, prev, and current to bypass every node whose value matches val in place.",
} satisfies ReadyProblemDefinition;
