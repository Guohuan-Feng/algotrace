import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 654,
  title: "Maximum Binary Tree",
  cnTitle: "最大二叉树",
  slug: "maximum-binary-tree",
  difficulty: "Medium",
  tags: ["Array", "Divide and Conquer", "Tree", "Monotonic Stack"],
  pattern: "Range maximum divide and conquer",
  collections: ["Binary Tree", "Divide and Conquer"],
  hasVisualizer: true,
  summary: "Ready visualizer: select the maximum of each interval, then recursively build its two remaining ranges.",
} satisfies ReadyProblemDefinition;
