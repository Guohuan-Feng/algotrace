import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 684,
  title: "Redundant Connection",
  cnTitle: "冗余连接",
  slug: "redundant-connection",
  difficulty: "Medium",
  tags: ["Graph", "Union Find", "DFS"],
  pattern: "Union-Find cycle detection",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: merge components edge by edge and return the first edge whose endpoints share a root.",
} satisfies ReadyProblemDefinition;
