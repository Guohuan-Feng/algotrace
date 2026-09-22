import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 80,
  title: "Remove Duplicates from Sorted Array II",
  cnTitle: "删除有序数组中的重复项 II",
  slug: "remove-duplicates-from-sorted-array-ii",
  difficulty: "Medium",
  tags: ["Array", "Two Pointers"],
  pattern: "Bounded duplicates",
  collections: ["Hot 150"],
  hasVisualizer: true,
  summary: "用双指针逐步比较、原地覆盖，让有序数组中的每个元素最多保留两次。",
} satisfies ReadyProblemDefinition;
