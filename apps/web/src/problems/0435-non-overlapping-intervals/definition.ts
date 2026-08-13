import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 435,
  title: "Non-overlapping Intervals",
  cnTitle: "无重叠区间",
  slug: "non-overlapping-intervals",
  difficulty: "Medium",
  tags: ["Greedy", "Intervals", "Sorting"],
  pattern: "Earliest-end greedy selection",
  collections: ["扫描线基础算法"],
  hasVisualizer: true,
  summary: "按终点排序，始终保留结束最早的兼容区间。",
} satisfies ReadyProblemDefinition;
