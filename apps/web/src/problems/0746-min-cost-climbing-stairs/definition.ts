import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 746,
  title: "Min Cost Climbing Stairs",
  cnTitle: "使用最小花费爬楼梯",
  slug: "min-cost-climbing-stairs",
  difficulty: "Easy",
  tags: ["Array", "Dynamic Programming"],
  pattern: "Minimum-cost step dynamic programming",
  collections: ["Dynamic Programming"],
  hasVisualizer: true,
  summary: "Ready visualizer: compute each landing cost from its cheaper one- or two-step predecessor.",
} satisfies ReadyProblemDefinition;
