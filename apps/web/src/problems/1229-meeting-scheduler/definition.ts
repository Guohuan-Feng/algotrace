import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 1229,
  title: "Meeting Scheduler",
  cnTitle: "会议时间安排",
  slug: "meeting-scheduler",
  difficulty: "Medium",
  tags: ["Intervals", "Two Pointers", "Sorting"],
  pattern: "Sort two schedules and advance the earlier end",
  collections: ["扫描线基础算法"],
  hasVisualizer: true,
  summary: "两个指针比较可用时间段，找到满足时长的最早交集。",
} satisfies ReadyProblemDefinition;
