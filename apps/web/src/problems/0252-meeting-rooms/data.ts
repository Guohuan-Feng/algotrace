import type { IntervalTraceDefinition } from "../../shared/intervals/types";
import { createMeetingRoomsDryRun } from "./dryRun";

export const traceDefinition = {
  title: "Meeting Rooms",
  cnTitle: "252. 会议室",
  order: 2,
  inputHint: "输入会议区间数组。只有 current.start < previous.end 时才冲突；接壤不冲突。",
  examples: [
    { id: 1, label: "冲突示例", input: [[0, 30], [5, 10], [15, 20]], output: "False" },
    { id: 2, label: "可参加示例", input: [[7, 10], [2, 4]], output: "True" },
  ],
  defaultExample: { id: 1, label: "冲突示例", input: [[0, 30], [5, 10], [15, 20]], output: "False" },
  codeLines: [
    "intervals = sorted(intervals)",
    "",
    "for index in range(1, len(intervals)):",
    "    current_start = intervals[index][0]",
    "    previous_end = intervals[index - 1][1]",
    "    if current_start < previous_end:",
    "        return False",
    "return True",
  ],
  createDryRun: createMeetingRoomsDryRun,
} satisfies IntervalTraceDefinition;
