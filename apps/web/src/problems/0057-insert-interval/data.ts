import type { IntervalTraceDefinition } from "../../shared/intervals/types";
import { createInsertIntervalDryRun } from "./dryRun";

export const traceDefinition = {
  title: "Insert Interval",
  cnTitle: "57. 插入区间",
  order: 5,
  inputHint: "输入 {\"intervals\": [[...]], \"newInterval\": [start,end]}。intervals 应有序且互不重叠。",
  examples: [
    { id: 1, label: "示例 1", input: { intervals: [[1, 3], [6, 9]], newInterval: [2, 5] }, output: "[[1,5], [6,9]]" },
    { id: 2, label: "跨多个区间", input: { intervals: [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval: [4, 8] }, output: "[[1,2], [3,10], [12,16]]" },
  ],
  defaultExample: { id: 1, label: "示例 1", input: { intervals: [[1, 3], [6, 9]], newInterval: [2, 5] }, output: "[[1,5], [6,9]]" },
  codeLines: [
    "result = []",
    "index = 0",
    "new_start, new_end = newInterval",
    "while index < len(intervals) and intervals[index][1] < new_start:",
    "    result.append(intervals[index]); index += 1",
    "",
    "while index < len(intervals) and intervals[index][0] <= new_end:",
    "    new_start = min(new_start, intervals[index][0])",
    "    new_end = max(new_end, intervals[index][1]); index += 1",
    "",
    "result.append([new_start, new_end])",
    "",
    "while index < len(intervals):",
    "    result.append(intervals[index]); index += 1",
    "return result",
  ],
  createDryRun: createInsertIntervalDryRun,
} satisfies IntervalTraceDefinition;
