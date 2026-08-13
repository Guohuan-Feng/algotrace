import type { IntervalTraceDefinition } from "../../shared/intervals/types";
import { createNonOverlappingIntervalsDryRun } from "./dryRun";

export const traceDefinition = {
  title: "Non-overlapping Intervals",
  cnTitle: "435. 无重叠区间",
  order: 7,
  inputHint: "输入区间数组。按终点排序后，current.start < keptEnd 表示当前区间必须删除。",
  examples: [
    { id: 1, label: "示例 1", input: [[1, 2], [2, 3], [3, 4], [1, 3]], output: "1" },
    { id: 2, label: "全部冲突", input: [[1, 2], [1, 2], [1, 2]], output: "2" },
  ],
  defaultExample: { id: 1, label: "示例 1", input: [[1, 2], [2, 3], [3, 4], [1, 3]], output: "1" },
  codeLines: [
    "intervals.sort(key=lambda interval: interval[1])",
    "removals = 0",
    "kept_end = intervals[0][1]",
    "",
    "for start, end in intervals[1:]:",
    "    if start < kept_end:",
    "        removals += 1",
    "    else:",
    "        kept_end = end",
    "return removals",
  ],
  createDryRun: createNonOverlappingIntervalsDryRun,
} satisfies IntervalTraceDefinition;
