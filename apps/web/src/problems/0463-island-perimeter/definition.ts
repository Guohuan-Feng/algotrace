import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 463,
  title: "Island Perimeter",
  cnTitle: "岛屿的周长",
  slug: "island-perimeter",
  difficulty: "Easy",
  tags: ["Array", "Depth-First Search", "Breadth-First Search", "Matrix"],
  pattern: "DFS exposed-edge counting",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: DFS marks land, returns 1 at water or the boundary, and sums the four directions.",
} satisfies ReadyProblemDefinition;
