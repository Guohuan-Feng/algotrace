import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 130,
  title: "Surrounded Regions",
  cnTitle: "被围绕的区域",
  slug: "surrounded-regions",
  difficulty: "Medium",
  tags: ["DFS", "BFS", "Union Find", "Matrix"],
  pattern: "Boundary flood fill",
  collections: ["Hot 150"],
  hasVisualizer: true,
  summary: "Ready visualizer: mark boundary-connected O cells with DFS, capture enclosed cells, then restore safe cells.",
} satisfies ReadyProblemDefinition;
