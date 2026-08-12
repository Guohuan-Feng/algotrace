import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 261,
  title: "Graph Valid Tree",
  cnTitle: "以图判树",
  slug: "graph-valid-tree",
  difficulty: "Medium",
  tags: ["Graph", "DFS", "Union Find"],
  pattern: "Undirected DFS with parent",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: traverse an undirected graph with DFS, reject cycles, then verify every node was reached.",
} satisfies ReadyProblemDefinition;
