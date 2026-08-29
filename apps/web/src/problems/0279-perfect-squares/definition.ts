import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 279,
  title: "Perfect Squares",
  cnTitle: "完全平方数",
  slug: "perfect-squares",
  difficulty: "Medium",
  tags: ["Math", "Dynamic Programming", "Breadth-First Search"],
  pattern: "Complete knapsack dynamic programming",
  collections: ["Dynamic Programming"],
  hasVisualizer: true,
  summary: "Ready visualizer: square each loop value, then relax every reachable sum from that square upward.",
} satisfies ReadyProblemDefinition;
