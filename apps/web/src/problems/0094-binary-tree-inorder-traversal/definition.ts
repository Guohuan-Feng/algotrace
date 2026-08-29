import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 94,
  title: "Binary Tree Inorder Traversal",
  cnTitle: "二叉树的中序遍历",
  slug: "binary-tree-inorder-traversal",
  difficulty: "Easy",
  tags: ["Stack", "Tree", "Depth-First Search", "Binary Tree"],
  pattern: "Left-root-right DFS",
  collections: ["Tree", "Traversal"],
  hasVisualizer: true,
  summary: "Ready visualizer: follow the recursive left-root-right call stack and append order.",
} satisfies ReadyProblemDefinition;
