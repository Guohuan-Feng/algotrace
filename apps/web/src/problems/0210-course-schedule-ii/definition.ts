import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 210,
  title: "Course Schedule II",
  cnTitle: "课程表 II",
  slug: "course-schedule-ii",
  difficulty: "Medium",
  tags: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"],
  pattern: "DFS postorder topological sort",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: use three DFS states, append finished courses in postorder, then reverse the result.",
} satisfies ReadyProblemDefinition;
