import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 1325,
  title: "Delete Leaves With a Given Value",
  cnTitle: "删除给定值的叶子节点",
  slug: "delete-leaves-with-a-given-value",
  difficulty: "Medium",
  tags: ["Tree", "Depth-First Search", "Binary Tree"],
  pattern: "Postorder pruning",
  collections: ["Binary Tree", "Depth-First Search"],
  hasVisualizer: true,
  summary: "Ready visualizer: remove child leaves first, then remove target-valued parents that become leaves.",
} satisfies ReadyProblemDefinition;
