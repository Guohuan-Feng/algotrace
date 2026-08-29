import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 59,
  title: "Spiral Matrix",
  cnTitle: "螺旋矩阵",
  slug: "spiral-matrix",
  difficulty: "Medium",
  tags: ["Array", "Matrix", "Simulation"],
  pattern: "Shrink four boundaries",
  collections: ["Hot 150", "Matrix"],
  hasVisualizer: true,
  summary: "Ready visualizer: walk the current rectangle clockwise, then shrink the completed top, right, bottom, and left boundaries.",
} satisfies ReadyProblemDefinition;
