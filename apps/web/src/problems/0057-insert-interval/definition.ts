import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 57,
  title: "Insert Interval",
  cnTitle: "插入区间",
  slug: "insert-interval",
  difficulty: "Medium",
  tags: ["Intervals", "Array"],
  pattern: "Left copy, merge overlap, right copy",
  collections: ["扫描线基础算法"],
  hasVisualizer: true,
  summary: "把输入分为左侧、重叠和右侧三段，完成有序插入。",
} satisfies ReadyProblemDefinition;
