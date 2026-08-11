import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 752,
  title: "Open the Lock",
  cnTitle: "打开转盘锁",
  slug: "open-the-lock",
  difficulty: "Medium",
  tags: ["BFS", "Hash Table", "String", "Queue"],
  pattern: "Level-order state BFS",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: explore lock states level by level, rotating one wheel forward or backward at a time.",
} satisfies ReadyProblemDefinition;
