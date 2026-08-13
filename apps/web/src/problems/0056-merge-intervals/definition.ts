import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 56,
  title: "Merge Intervals",
  cnTitle: "合并区间",
  slug: "merge-intervals",
  difficulty: "Medium",
  tags: ["Intervals", "Sorting", "Array"],
  pattern: "Sort by start and merge the output tail",
  collections: ["扫描线基础算法"],
  hasVisualizer: true,
  summary: "按起点排序，动态扩展结果尾部以合并重叠区间。",
} satisfies ReadyProblemDefinition;
