import type { IntervalTraceDefinition } from "../../shared/intervals/types";
import { createRemoveCoveredIntervalsDryRun } from "./dryRun";

export const traceDefinition = {
  title: "Remove Covered Intervals",
  cnTitle: "1288. 移除被覆盖区间",
  order: 8,
  inputHint: "输入区间数组。排序规则是起点升序、终点降序；end <= farthestEnd 表示已被覆盖。",
  examples: [
    { id: 1, label: "示例 1", input: [[1, 4], [3, 6], [2, 8]], output: "2" },
    { id: 2, label: "同起点", input: [[1, 4], [1, 2], [2, 3]], output: "1" },
  ],
  defaultExample: { id: 1, label: "示例 1", input: [[1, 4], [3, 6], [2, 8]], output: "2" },
  codeLines: [
    "intervals.sort(key=lambda interval: (interval[0], -interval[1]))",
    "remaining = 0",
    "farthest_end = float('-inf')",
    "for _, end in intervals:",
    "    if end > farthest_end:",
    "        remaining += 1",
    "        farthest_end = end",
    "return remaining",
  ],
  createDryRun: createRemoveCoveredIntervalsDryRun,
} satisfies IntervalTraceDefinition;
