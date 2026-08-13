import type { IntervalTraceDefinition } from "../../shared/intervals/types";
import { createMergeIntervalsDryRun } from "./dryRun";

export const traceDefinition = {
  title: "Merge Intervals",
  cnTitle: "56. 合并区间",
  order: 4,
  inputHint: "输入任意顺序的区间数组。当前区间 start <= 结果尾 end 时需要合并；接壤也合并。",
  examples: [
    { id: 1, label: "示例 1", input: [[1, 3], [2, 6], [8, 10], [15, 18]], output: "[[1,6], [8,10], [15,18]]" },
    { id: 2, label: "接壤示例", input: [[1, 4], [4, 5]], output: "[[1,5]]" },
  ],
  defaultExample: { id: 1, label: "示例 1", input: [[1, 3], [2, 6], [8, 10], [15, 18]], output: "[[1,6], [8,10], [15,18]]" },
  codeLines: [
    "merged = []",
    "for start, end in sorted(intervals):",
    "    if not merged or start > merged[-1][1]:",
    "        merged.append([start, end])",
    "    else:",
    "        merged[-1][1] = max(merged[-1][1], end)",
    "return merged",
  ],
  createDryRun: createMergeIntervalsDryRun,
} satisfies IntervalTraceDefinition;
