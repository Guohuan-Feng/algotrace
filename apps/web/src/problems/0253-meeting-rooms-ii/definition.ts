import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 253,
  title: "Meeting Rooms II",
  cnTitle: "会议室 II",
  slug: "meeting-rooms-ii",
  difficulty: "Medium",
  tags: ["Sweep Line", "Intervals", "Sorting"],
  pattern: "Event sweep and maximum overlap",
  collections: ["扫描线基础算法"],
  hasVisualizer: true,
  summary: "把会议变成起止事件，最大重叠量就是最少会议室数。",
} satisfies ReadyProblemDefinition;
