import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 391,
  title: "Number of Airplanes in the Sky",
  cnTitle: "天空中的飞机数量",
  slug: "number-of-airplanes-in-the-sky",
  difficulty: "Medium",
  tags: ["Sweep Line", "Intervals", "Sorting"],
  pattern: "Event sweep and maximum prefix sum",
  collections: ["扫描线基础算法"],
  hasVisualizer: true,
  summary: "逐事件扫描起飞与降落，观察同时在空飞机数如何形成峰值。",
} satisfies ReadyProblemDefinition;
