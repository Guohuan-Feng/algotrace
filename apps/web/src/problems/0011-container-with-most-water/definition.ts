import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 11,
  title: "Container With Most Water",
  cnTitle: "盛最多水的容器",
  slug: "container-with-most-water",
  difficulty: "Medium",
  tags: ["Array", "Two Pointers", "Greedy"],
  pattern: "Move the shorter boundary",
  collections: ["Two Pointers"],
  hasVisualizer: true,
  summary: "Ready visualizer: compare the two boundaries, record the current area, then discard the shorter one.",
} satisfies ReadyProblemDefinition;
