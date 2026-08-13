import type { IntervalTraceDefinition } from "../../shared/intervals/types";
import { createNumberOfAirplanesDryRun } from "./dryRun";

export const traceDefinition = {
  title: "Number of Airplanes in the Sky",
  cnTitle: "391. 飞机数量统计",
  order: 1,
  inputHint: "输入区间数组，例如 [[1,10],[2,3],[5,8]]。同一时刻先降落再起飞。",
  examples: [
    { id: 1, label: "示例 1", input: [[1, 10], [2, 3], [5, 8]], output: "3" },
    { id: 2, label: "接壤复用", input: [[1, 2], [2, 5], [3, 4]], output: "2" },
  ],
  defaultExample: { id: 1, label: "示例 1", input: [[1, 10], [2, 3], [5, 8]], output: "3" },
  codeLines: [
    "events = []",
    "for start, end in intervals:",
    "    events += [(start, 1), (end, -1)]",
    "events.sort()  # 同时刻 -1 在 +1 前",
    "flying = maximum = 0",
    "for _, change in events:",
    "    flying += change",
    "    maximum = max(maximum, flying)",
    "return maximum",
  ],
  createDryRun: createNumberOfAirplanesDryRun,
} satisfies IntervalTraceDefinition;
