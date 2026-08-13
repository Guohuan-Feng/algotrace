import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 1272,
  title: "Remove Interval",
  cnTitle: "移除区间",
  slug: "remove-interval",
  difficulty: "Medium",
  tags: ["Intervals", "Array"],
  pattern: "Preserve left and right fragments",
  collections: ["扫描线基础算法"],
  hasVisualizer: true,
  summary: "用待删除区间遮罩输入，保留左右两侧没有被覆盖的片段。",
} satisfies ReadyProblemDefinition;
