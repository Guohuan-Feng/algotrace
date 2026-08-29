import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 114,
  title: "Flatten Binary Tree to Linked List",
  cnTitle: "二叉树展开为链表",
  slug: "flatten-binary-tree-to-linked-list",
  difficulty: "Medium",
  tags: ["Linked List", "Stack", "Tree", "Depth-First Search", "Binary Tree"],
  pattern: "Reverse-preorder pointer rewiring",
  collections: ["Hot 150", "Tree", "Linked List"],
  hasVisualizer: true,
  summary: "Ready visualizer: recursively process right then left, turning every node into a right-only preorder list.",
} satisfies ReadyProblemDefinition;
