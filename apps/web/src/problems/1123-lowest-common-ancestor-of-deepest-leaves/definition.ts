import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 1123,
  title: "Lowest Common Ancestor of Deepest Leaves",
  cnTitle: "最深叶节点的最近公共祖先",
  slug: "lowest-common-ancestor-of-deepest-leaves",
  difficulty: "Medium",
  tags: ["Tree", "Depth-First Search", "Binary Tree"],
  pattern: "Postorder deepest-depth return pair",
  collections: ["Binary Tree", "Depth-First Search"],
  hasVisualizer: true,
  summary: "Ready visualizer: compare each subtree's deepest depth; equal depths make the current node the LCA.",
} satisfies ReadyProblemDefinition;
