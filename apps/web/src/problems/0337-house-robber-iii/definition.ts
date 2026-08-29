import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 337,
  title: "House Robber III",
  cnTitle: "打家劫舍 III",
  slug: "house-robber-iii",
  difficulty: "Medium",
  tags: ["Tree", "Depth-First Search", "Dynamic Programming", "Binary Tree"],
  pattern: "Tree DP with rob / skip states",
  collections: ["Binary Tree", "Dynamic Programming"],
  hasVisualizer: true,
  summary: "Ready visualizer: compute the best total when each subtree root is robbed or skipped, then combine those two states bottom-up.",
} satisfies ReadyProblemDefinition;
