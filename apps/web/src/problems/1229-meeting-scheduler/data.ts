import type { IntervalTraceDefinition } from "../../shared/intervals/types";
import { createMeetingSchedulerDryRun } from "./dryRun";

const firstExample = {
  id: 1,
  label: "LeetCode 1",
  input: {
    slots1: [[10, 50], [60, 120], [140, 210]],
    slots2: [[0, 15], [60, 70]],
    duration: 8,
  },
  output: "[60, 68]",
};

const secondExample = {
  id: 2,
  label: "LeetCode 2",
  input: {
    slots1: [[10, 50], [60, 120], [140, 210]],
    slots2: [[0, 15], [60, 70]],
    duration: 12,
  },
  output: "[]",
};

export const traceDefinition = {
  title: "Meeting Scheduler",
  cnTitle: "1229. 会议时间安排",
  order: 10,
  inputHint: "输入 { slots1, slots2, duration }。每次移动结束时间更早的指针。",
  examples: [firstExample, secondExample],
  defaultExample: firstExample,
  codeLines: [
    "from typing import List",
    "",
    "class Solution:",
    "    def minAvailableDuration(",
    "        self,",
    "        slots1: List[List[int]],",
    "        slots2: List[List[int]],",
    "        duration: int",
    "    ) -> List[int]:",
    "",
    "        slots1.sort()",
    "        slots2.sort()",
    "",
    "        i = j = 0",
    "",
    "        while i < len(slots1) and j < len(slots2):",
    "            start = max(slots1[i][0], slots2[j][0])",
    "            end = min(slots1[i][1], slots2[j][1])",
    "",
    "            if end - start >= duration:",
    "                return [start, start + duration]",
    "",
    "            if slots1[i][1] < slots2[j][1]:",
    "                i += 1",
    "            else:",
    "                j += 1",
    "",
    "        return []",
  ],
  createDryRun: createMeetingSchedulerDryRun,
} satisfies IntervalTraceDefinition;
