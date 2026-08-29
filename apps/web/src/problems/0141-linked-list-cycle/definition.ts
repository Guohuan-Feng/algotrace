import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 141,
  title: "Linked List Cycle",
  cnTitle: "环形链表",
  slug: "linked-list-cycle",
  difficulty: "Easy",
  tags: ["Hash Table", "Linked List", "Two Pointers"],
  pattern: "Floyd fast and slow pointers",
  collections: ["Hot 150", "Linked List", "Two Pointers"],
  hasVisualizer: true,
  summary: "Ready visualizer: move slow one link and fast two links until they meet inside a cycle or fast reaches None.",
} satisfies ReadyProblemDefinition;
