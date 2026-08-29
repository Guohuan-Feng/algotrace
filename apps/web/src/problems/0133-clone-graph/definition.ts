import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 133,
  title: "Clone Graph",
  cnTitle: "克隆图",
  slug: "clone-graph",
  difficulty: "Medium",
  tags: ["Hash Table", "Depth-First Search", "Breadth-First Search", "Graph"],
  pattern: "DFS graph cloning with visited map",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: create each clone once, save it in visited before recursion, then reproduce every neighbor edge.",
} satisfies ReadyProblemDefinition;
