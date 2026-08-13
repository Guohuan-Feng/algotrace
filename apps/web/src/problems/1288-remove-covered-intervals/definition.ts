import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 1288,
  title: "Remove Covered Intervals",
  cnTitle: "移除被覆盖区间",
  slug: "remove-covered-intervals",
  difficulty: "Medium",
  tags: ["Intervals", "Sorting"],
  pattern: "Start ascending, end descending, track farthest end",
  collections: ["扫描线基础算法"],
  hasVisualizer: true,
  summary: "同起点长区间优先，维护最远终点来识别被完全覆盖的区间。",
} satisfies ReadyProblemDefinition;
