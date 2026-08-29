import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 416,
  title: "Partition Equal Subset Sum",
  cnTitle: "分割等和子集",
  slug: "partition-equal-subset-sum",
  difficulty: "Medium",
  tags: ["Array", "Dynamic Programming"],
  pattern: "0/1 knapsack dynamic programming",
  collections: ["Dynamic Programming"],
  hasVisualizer: true,
  summary: "Ready visualizer: fill reachable subset sums backward once for each number.",
} satisfies ReadyProblemDefinition;
