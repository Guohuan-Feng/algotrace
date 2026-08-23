import type { SummaryRange } from "./dryRun";

export type SummaryRangesExample = {
  id: 1;
  label: "LeetCode 1";
  values: number[];
  output: SummaryRange[];
};

export const title = "352. Data Stream as Disjoint Intervals";

export const examples: SummaryRangesExample[] = [
  {
    id: 1,
    label: "LeetCode 1",
    values: [1, 3, 7, 2, 6],
    output: [[1, 3], [6, 7]],
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class SummaryRanges:",
  "    def __init__(self):",
  "        self.intervals = []",
  "",
  "    def addNum(self, value: int) -> None:",
  "        new = [value, value]",
  "        res = []",
  "",
  "        for left, right in self.intervals:",
  "            if right + 1 < new[0]:",
  "                res.append([left, right])",
  "            elif new[1] + 1 < left:",
  "                res.append(new)",
  "                new = [left, right]",
  "            else:",
  "                new[0] = min(new[0], left)",
  "                new[1] = max(new[1], right)",
  "",
  "        res.append(new)",
  "        self.intervals = res",
  "",
  "    def getIntervals(self) -> List[List[int]]:",
  "        return self.intervals",
];
