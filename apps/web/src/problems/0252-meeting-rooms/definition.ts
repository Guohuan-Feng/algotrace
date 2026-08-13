import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 252,
  title: "Meeting Rooms",
  cnTitle: "会议室",
  slug: "meeting-rooms",
  difficulty: "Easy",
  tags: ["Intervals", "Sorting"],
  pattern: "Sort and compare neighboring intervals",
  collections: ["扫描线基础算法"],
  hasVisualizer: true,
  summary: "按开始时间排序后，只检查相邻会议是否重叠。",
} satisfies ReadyProblemDefinition;
