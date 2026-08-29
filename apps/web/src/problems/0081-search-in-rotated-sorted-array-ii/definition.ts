import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 81,
  title: "Search in Rotated Sorted Array II",
  cnTitle: "搜索旋转排序数组 II",
  slug: "search-in-rotated-sorted-array-ii",
  difficulty: "Medium",
  tags: ["Array", "Binary Search"],
  pattern: "Rotated binary search with duplicate shrink",
  collections: ["Binary Search"],
  hasVisualizer: true,
  summary: "Ready visualizer: find an ordered half when possible, otherwise shrink identical endpoints that conceal the rotation pivot.",
} satisfies ReadyProblemDefinition;
