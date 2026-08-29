import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 15,
  title: "3Sum",
  cnTitle: "三数之和",
  slug: "3sum",
  difficulty: "Medium",
  tags: ["Array", "Two Pointers", "Sorting"],
  pattern: "Sort + two pointers",
  collections: ["Hot 150"],
  hasVisualizer: true,
  summary: "Ready visualizer: fix one sorted value, then move opposite pointers until every zero-sum triplet is found once.",
} satisfies ReadyProblemDefinition;
