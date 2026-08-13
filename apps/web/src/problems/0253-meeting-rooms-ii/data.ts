import type { IntervalTraceDefinition } from "../../shared/intervals/types";
import { createMeetingRoomsTwoDryRun } from "./dryRun";

export const traceDefinition = {
  title: "Meeting Rooms II",
  cnTitle: "253. 会议室 II",
  order: 3,
  inputHint: "输入会议区间数组。结束事件优先，表示会议室可以在同一时刻复用。",
  examples: [
    { id: 1, label: "示例 1", input: [[0, 30], [5, 10], [15, 20]], output: "2" },
    { id: 2, label: "接壤复用", input: [[7, 10], [2, 4], [4, 7]], output: "1" },
  ],
  defaultExample: { id: 1, label: "示例 1", input: [[0, 30], [5, 10], [15, 20]], output: "2" },
  codeLines: [
    "events = []",
    "for start, end in intervals:",
    "    events += [(start, 1), (end, -1)]",
    "events.sort()",
    "rooms_in_use = minimum_rooms = 0",
    "for _, change in events:",
    "    rooms_in_use += change",
    "    minimum_rooms = max(minimum_rooms, rooms_in_use)",
    "return minimum_rooms",
  ],
  createDryRun: createMeetingRoomsTwoDryRun,
} satisfies IntervalTraceDefinition;
