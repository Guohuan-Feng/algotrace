import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 88,
  title: "Merge Sorted Array",
  cnTitle: "合并两个有序数组",
  slug: "merge-sorted-array",
  difficulty: "Easy",
  tags: ["Array", "Two Pointers", "Sorting"],
  pattern: "Backfill from the tail",
  collections: ["Hot 150", "Array / String"],
  hasVisualizer: true,
  summary: "Ready visualizer: compare the final unread values and fill nums1 from the back so its live prefix is never overwritten.",
} satisfies ReadyProblemDefinition;
