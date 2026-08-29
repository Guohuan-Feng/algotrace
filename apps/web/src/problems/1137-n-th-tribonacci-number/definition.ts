import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 1137,
  title: "N-th Tribonacci Number",
  cnTitle: "第 N 个泰波那契数",
  slug: "n-th-tribonacci-number",
  difficulty: "Easy",
  tags: ["Memoization", "Math", "Dynamic Programming"],
  pattern: "Three-state recurrence dynamic programming",
  collections: ["Dynamic Programming"],
  hasVisualizer: true,
  summary: "Ready visualizer: seed 0, 1, 1 and sum the three previous states at every later index.",
} satisfies ReadyProblemDefinition;
