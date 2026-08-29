import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 86,
  title: "Partition List",
  cnTitle: "分隔链表",
  slug: "partition-list",
  difficulty: "Medium",
  tags: ["Linked List", "Two Pointers"],
  pattern: "Stable split with two dummy lists",
  collections: ["Hot 150", "Linked List"],
  hasVisualizer: true,
  summary: "Ready visualizer: append each node to a below-x or at-least-x dummy list, then join the two stable partitions.",
} satisfies ReadyProblemDefinition;
