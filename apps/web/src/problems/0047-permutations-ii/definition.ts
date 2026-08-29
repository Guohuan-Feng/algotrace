import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 47,
  title: "Permutations II",
  cnTitle: "全排列 II",
  slug: "permutations-ii",
  difficulty: "Medium",
  tags: ["Array", "Backtracking", "Sorting"],
  pattern: "Sorted duplicate-guard backtracking",
  collections: ["Backtracking"],
  hasVisualizer: true,
  summary: "Ready visualizer: sort duplicates, track used indices, and skip equal values whose previous copy is unused.",
} satisfies ReadyProblemDefinition;
