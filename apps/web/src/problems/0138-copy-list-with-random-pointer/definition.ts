import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 138,
  title: "Copy List with Random Pointer",
  cnTitle: "随机链表的复制",
  slug: "copy-list-with-random-pointer",
  difficulty: "Medium",
  tags: ["Hash Table", "Linked List"],
  pattern: "Interleaved deep copy",
  collections: ["Hot 150", "Linked List", "Hash Table"],
  hasVisualizer: true,
  summary: "Ready visualizer: weave copy nodes into the original list, derive random pointers through neighboring copies, then detach both chains.",
} satisfies ReadyProblemDefinition;
