import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 18,
  title: "4Sum",
  cnTitle: "四数之和",
  slug: "4sum",
  difficulty: "Medium",
  tags: ["Array", "Two Pointers", "Sorting"],
  pattern: "Two anchors + two pointers",
  collections: ["Array / String"],
  hasVisualizer: true,
  summary: "Ready visualizer: fix two sorted anchors, then move left and right to find each target-sum quadruplet once.",
} satisfies ReadyProblemDefinition;
