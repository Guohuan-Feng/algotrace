import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 322,
  title: "Coin Change",
  cnTitle: "零钱兑换",
  slug: "coin-change",
  difficulty: "Medium",
  tags: ["Array", "Dynamic Programming", "Breadth-First Search"],
  pattern: "Unbounded minimum-count dynamic programming",
  collections: ["Dynamic Programming"],
  hasVisualizer: true,
  summary: "Ready visualizer: process each target amount and relax it with every coin denomination.",
} satisfies ReadyProblemDefinition;
