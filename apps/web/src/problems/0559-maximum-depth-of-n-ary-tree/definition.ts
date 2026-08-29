import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 559,
  title: "Maximum Depth of N-ary Tree",
  cnTitle: "N 叉树的最大深度",
  slug: "maximum-depth-of-n-ary-tree",
  difficulty: "Easy",
  tags: ["Tree", "Depth-First Search", "Breadth-First Search"],
  pattern: "Postorder DFS depth",
  collections: ["Binary Tree", "Depth-First Search"],
  hasVisualizer: true,
  summary: "Ready visualizer: recurse through every child and return one plus the deepest child depth.",
} satisfies ReadyProblemDefinition;
