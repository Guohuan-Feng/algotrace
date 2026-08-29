import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 76,
  title: "Minimum Window Substring",
  cnTitle: "最小覆盖子串",
  slug: "minimum-window-substring",
  difficulty: "Hard",
  tags: ["Hash Table", "String", "Sliding Window"],
  pattern: "Variable-size cover window",
  collections: ["Sliding Window"],
  hasVisualizer: true,
  summary: "Ready visualizer: expand until every target count is satisfied, then shrink to the shortest valid window.",
} satisfies ReadyProblemDefinition;
