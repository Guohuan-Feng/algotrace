import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 84,
  title: "Largest Rectangle in Histogram",
  cnTitle: "柱状图中最大的矩形",
  slug: "largest-rectangle-in-histogram",
  difficulty: "Hard",
  tags: ["Array", "Stack", "Monotonic Stack"],
  pattern: "Monotonic increasing index stack",
  collections: ["Stack"],
  hasVisualizer: true,
  summary: "Ready visualizer: use a decreasing height to settle every rectangle whose right boundary is fixed.",
} satisfies ReadyProblemDefinition;
