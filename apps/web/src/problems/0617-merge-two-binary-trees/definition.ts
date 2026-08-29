import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 617,
  title: "Merge Two Binary Trees",
  cnTitle: "合并二叉树",
  slug: "merge-two-binary-trees",
  difficulty: "Easy",
  tags: ["Tree", "Depth-First Search", "Binary Tree"],
  pattern: "Parallel DFS merge",
  collections: ["Binary Tree", "Depth-First Search"],
  hasVisualizer: true,
  summary: "Ready visualizer: sum overlapping nodes and carry one-sided branches unchanged into the output tree.",
} satisfies ReadyProblemDefinition;
