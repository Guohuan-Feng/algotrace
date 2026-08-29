import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 75,
  title: "Sort Colors",
  cnTitle: "颜色分类",
  slug: "sort-colors",
  difficulty: "Medium",
  tags: ["Array", "Two Pointers", "Sorting"],
  pattern: "Dutch National Flag",
  collections: ["Sorting", "Two Pointers"],
  hasVisualizer: true,
  summary: "Ready visualizer: maintain three regions with low, mid, and high while swapping 0s left and 2s right.",
} satisfies ReadyProblemDefinition;
