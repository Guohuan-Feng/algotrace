import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 695,
  title: "Max Area of Island",
  cnTitle: "岛屿的最大面积",
  slug: "max-area-of-island",
  difficulty: "Medium",
  tags: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"],
  pattern: "DFS flood fill with area return",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: erase an island during DFS, add recursive return values, and retain the maximum completed area.",
} satisfies ReadyProblemDefinition;
