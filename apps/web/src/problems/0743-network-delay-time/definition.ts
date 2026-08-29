import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 743,
  title: "Network Delay Time",
  cnTitle: "网络延迟时间",
  slug: "network-delay-time",
  difficulty: "Medium",
  tags: ["Depth-First Search", "Breadth-First Search", "Graph", "Heap (Priority Queue)", "Shortest Path"],
  pattern: "Dijkstra shortest path",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: repeatedly pop the shortest pending signal path and relax its weighted outgoing edges.",
} satisfies ReadyProblemDefinition;
