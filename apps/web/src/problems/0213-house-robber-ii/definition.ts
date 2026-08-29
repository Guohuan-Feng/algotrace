import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 213,
  title: "House Robber II",
  cnTitle: "打家劫舍 II",
  slug: "house-robber-ii",
  difficulty: "Medium",
  tags: ["Array", "Dynamic Programming"],
  pattern: "Two linear dynamic-programming cases for a circle",
  collections: ["Dynamic Programming"],
  hasVisualizer: true,
  summary: "Ready visualizer: exclude the last house once, exclude the first house once, then compare both runs.",
} satisfies ReadyProblemDefinition;
