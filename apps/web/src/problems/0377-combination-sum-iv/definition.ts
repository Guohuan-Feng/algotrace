import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 377,
  title: "Combination Sum IV",
  cnTitle: "组合总和 IV",
  slug: "combination-sum-iv",
  difficulty: "Medium",
  tags: ["Array", "Dynamic Programming"],
  pattern: "Ordered combination counting DP",
  collections: ["Dynamic Programming"],
  hasVisualizer: true,
  summary: "Ready visualizer: process each target first and add the ways that end with every eligible number.",
} satisfies ReadyProblemDefinition;
