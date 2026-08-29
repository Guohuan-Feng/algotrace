import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 399,
  title: "Evaluate Division",
  cnTitle: "除法求值",
  slug: "evaluate-division",
  difficulty: "Medium",
  tags: ["Array", "String", "Depth-First Search", "Breadth-First Search", "Union Find", "Graph", "Shortest Path"],
  pattern: "Weighted graph depth-first search",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: build reciprocal weighted edges, then multiply edge weights along each query DFS path.",
} satisfies ReadyProblemDefinition;
