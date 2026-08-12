import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 1462,
  title: "Course Schedule IV",
  cnTitle: "课程表 IV",
  slug: "course-schedule-iv",
  difficulty: "Medium",
  tags: ["Graph", "DFS", "Topological Sort"],
  pattern: "Per-query reachability DFS",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: run DFS for every prerequisite query and record whether its target course is reachable.",
} satisfies ReadyProblemDefinition;
