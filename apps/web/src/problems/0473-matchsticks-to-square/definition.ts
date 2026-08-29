import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 473,
  title: "Matchsticks to Square",
  cnTitle: "火柴拼正方形",
  slug: "matchsticks-to-square",
  difficulty: "Medium",
  tags: ["Array", "Dynamic Programming", "Backtracking", "Bit Manipulation"],
  pattern: "Descending four-bin backtracking",
  collections: ["Backtracking"],
  hasVisualizer: true,
  summary: "Ready visualizer: sort descending and assign each stick to one of four equal-length sides.",
} satisfies ReadyProblemDefinition;
