import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 226,
  title: "Invert Binary Tree",
  cnTitle: "翻转二叉树",
  slug: "invert-binary-tree",
  difficulty: "Easy",
  tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
  pattern: "Recursive subtree swap",
  collections: ["Hot 150", "Tree", "Depth-First Search"],
  hasVisualizer: true,
  summary: "Ready visualizer: swap each node's left and right child, then recursively invert the swapped subtrees.",
} satisfies ReadyProblemDefinition;
