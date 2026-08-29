import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 200,
  title: "Number of Islands",
  cnTitle: "岛屿数量",
  slug: "number-of-islands",
  difficulty: "Medium",
  tags: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"],
  pattern: "Flood-fill DFS connected components",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: discover an unvisited land cell, increment the component count, and erase the whole island with DFS.",
} satisfies ReadyProblemDefinition;
