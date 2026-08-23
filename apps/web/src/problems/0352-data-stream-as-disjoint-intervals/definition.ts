import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 352,
  title: "Data Stream as Disjoint Intervals",
  cnTitle: "数据流中的不相交区间",
  slug: "data-stream-as-disjoint-intervals",
  difficulty: "Hard",
  tags: ["Design", "Intervals", "Ordered Set"],
  pattern: "Rebuild sorted disjoint intervals for each number",
  collections: ["扫描线基础算法"],
  hasVisualizer: true,
  summary: "逐个插入数字，观察 new、res 与 intervals 如何维护有序不相交区间。",
} satisfies ReadyProblemDefinition;
