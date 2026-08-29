import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 124,
  title: "Binary Tree Maximum Path Sum",
  cnTitle: "二叉树中的最大路径和",
  slug: "binary-tree-maximum-path-sum",
  difficulty: "Hard",
  tags: ["Tree", "Depth-First Search", "Dynamic Programming", "Binary Tree"],
  pattern: "Postorder path gain",
  collections: ["Hot 150", "Tree", "Dynamic Programming"],
  hasVisualizer: true,
  summary: "Ready visualizer: return one non-negative branch gain upward while each node tests a two-branch path against the global maximum.",
} satisfies ReadyProblemDefinition;
