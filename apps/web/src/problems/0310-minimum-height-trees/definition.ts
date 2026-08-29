import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 310,
  title: "Minimum Height Trees",
  cnTitle: "最小高度树",
  slug: "minimum-height-trees",
  difficulty: "Medium",
  tags: ["Tree", "Breadth-First Search", "Graph", "Topological Sort"],
  pattern: "Leaf-trimming topological BFS",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: remove one leaf layer at a time until the one or two tree centers remain.",
} satisfies ReadyProblemDefinition;
