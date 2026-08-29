import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 572,
  title: "Subtree of Another Tree",
  cnTitle: "另一棵树的子树",
  slug: "subtree-of-another-tree",
  difficulty: "Easy",
  tags: ["Tree", "Depth-First Search", "Binary Tree"],
  pattern: "DFS candidates plus exact tree comparison",
  collections: ["Binary Tree", "Depth-First Search"],
  hasVisualizer: true,
  summary: "Ready visualizer: test every root candidate, then compare both values and child shapes recursively.",
} satisfies ReadyProblemDefinition;
