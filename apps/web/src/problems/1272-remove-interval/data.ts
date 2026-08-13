import type { IntervalTraceDefinition } from "../../shared/intervals/types";
import { createRemoveIntervalDryRun } from "./dryRun";

export const traceDefinition = {
  title: "Remove Interval",
  cnTitle: "1272. 移除区间",
  order: 6,
  inputHint: "输入 {\"intervals\": [[...]], \"toBeRemoved\": [start,end]}。可观察一个区间如何被切成两段。",
  examples: [
    { id: 1, label: "示例 1", input: { intervals: [[0, 2], [3, 4], [5, 7]], toBeRemoved: [1, 6] }, output: "[[0,1], [6,7]]" },
    { id: 2, label: "双侧切分", input: { intervals: [[0, 10]], toBeRemoved: [3, 7] }, output: "[[0,3], [7,10]]" },
  ],
  defaultExample: { id: 1, label: "示例 1", input: { intervals: [[0, 2], [3, 4], [5, 7]], toBeRemoved: [1, 6] }, output: "[[0,1], [6,7]]" },
  codeLines: [
    "result = []",
    "remove_start, remove_end = toBeRemoved",
    "",
    "for start, end in intervals:",
    "    if end <= remove_start or start >= remove_end:",
    "        result.append([start, end]); continue",
    "",
    "    if start < remove_start:",
    "        result.append([start, remove_start])",
    "",
    "    if end > remove_end:",
    "        result.append([remove_end, end])",
    "return result",
  ],
  createDryRun: createRemoveIntervalDryRun,
} satisfies IntervalTraceDefinition;
