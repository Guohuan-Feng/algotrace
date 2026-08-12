import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 323,
  title: "Number of Connected Components in an Undirected Graph",
  cnTitle: "无向图中连通分量的数目",
  slug: "number-of-connected-components-in-an-undirected-graph",
  difficulty: "Medium",
  tags: ["Graph", "DFS", "BFS", "Union Find"],
  pattern: "DFS connected components",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: start DFS from each unvisited node and count every connected component.",
} satisfies ReadyProblemDefinition;
