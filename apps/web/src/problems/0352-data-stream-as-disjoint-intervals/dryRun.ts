import type { FrameKind } from "../../shared/types";

export type SummaryRange = [number, number];
export type SummaryRangesBranch = "left" | "right" | "merge" | null;

export type SummaryRangesFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  values: number[];
  operationIndex: number;
  value: number | null;
  intervals: SummaryRange[];
  newInterval: SummaryRange | null;
  res: SummaryRange[];
  scannedInterval: SummaryRange | null;
  branch: SummaryRangesBranch;
  result: SummaryRange[];
};

function cloneRange(range: SummaryRange): SummaryRange {
  return [range[0], range[1]];
}

function cloneRanges(ranges: SummaryRange[]): SummaryRange[] {
  return ranges.map(cloneRange);
}

export function createSummaryRangesDryRun(values: number[]): { frames: SummaryRangesFrame[] } {
  const frames: SummaryRangesFrame[] = [];
  let intervals: SummaryRange[] = [];
  let operationIndex = -1;
  let value: number | null = null;
  let newInterval: SummaryRange | null = null;
  let res: SummaryRange[] = [];
  let scannedInterval: SummaryRange | null = null;
  let branch: SummaryRangesBranch = null;

  const push = (frame: Omit<SummaryRangesFrame, "values" | "operationIndex" | "value" | "intervals" | "newInterval" | "res" | "scannedInterval" | "branch" | "result"> & { result?: SummaryRange[] }) => {
    frames.push({
      ...frame,
      values: [...values],
      operationIndex,
      value,
      intervals: cloneRanges(intervals),
      newInterval: newInterval ? cloneRange(newInterval) : null,
      res: cloneRanges(res),
      scannedInterval: scannedInterval ? cloneRange(scannedInterval) : null,
      branch,
      result: cloneRanges(frame.result ?? intervals),
    });
  };

  push({
    kind: "start",
    title: "Initialize an empty interval list",
    detail: "The constructor sets self.intervals to an empty list.",
    activeLines: [4, 5],
  });

  values.forEach((nextValue, index) => {
    operationIndex = index;
    value = nextValue;
    newInterval = [nextValue, nextValue];
    res = [];
    scannedInterval = null;
    branch = null;

    push({
      kind: "start",
      title: "Start addNum(" + nextValue + ")",
      detail: "Create new = [value, value] and an empty res list for this insertion.",
      activeLines: [7, 8, 9],
    });

    intervals.forEach((existing) => {
      const left = existing[0];
      const right = existing[1];
      const currentNew = newInterval;
      if (!currentNew) return;
      scannedInterval = cloneRange(existing);
      branch = null;
      push({
        kind: "visit",
        title: "Scan " + formatRange(existing),
        detail: "Compare the current stored interval with the mutable new interval.",
        activeLines: [11],
      });

      if (right + 1 < currentNew[0]) {
        branch = "left";
        res.push([left, right]);
        push({
          kind: "build",
          title: "Keep a left interval",
          detail: right + " + 1 < " + currentNew[0] + "; " + formatRange(existing) + " stays before new.",
          activeLines: [12, 13],
        });
        return;
      }

      if (currentNew[1] + 1 < left) {
        branch = "right";
        res.push(cloneRange(currentNew));
        push({
          kind: "build",
          title: "Insert new before the right interval",
          detail: currentNew[1] + " + 1 < " + left + "; append " + formatRange(currentNew) + " before the right side.",
          activeLines: [14, 15],
        });
        newInterval = [left, right];
        push({
          kind: "build",
          title: "Continue with the scanned interval",
          detail: "new becomes " + formatRange(newInterval) + " so it can be copied after the right side.",
          activeLines: [16],
        });
        return;
      }

      branch = "merge";
      newInterval = [
        Math.min(currentNew[0], left),
        Math.max(currentNew[1], right),
      ];
      push({
        kind: "build",
        title: "Merge overlapping or adjacent intervals",
        detail: formatRange(currentNew) + " touches " + formatRange(existing) + ", so new expands to " + formatRange(newInterval) + ".",
        activeLines: [17, 18, 19],
      });
    });

    scannedInterval = null;
    branch = null;
    if (!newInterval) return;
    res.push(cloneRange(newInterval));
    push({
      kind: "build",
      title: "Append the final new interval",
      detail: "All stored intervals are scanned, so append " + formatRange(newInterval) + " to res.",
      activeLines: [21],
    });

    intervals = cloneRanges(res);
    push({
      kind: "build",
      title: "Save the rebuilt intervals",
      detail: "self.intervals becomes " + formatRanges(intervals) + ".",
      activeLines: [22],
    });
  });

  value = null;
  newInterval = null;
  res = cloneRanges(intervals);
  scannedInterval = null;
  branch = null;
  push({
    kind: "done",
    title: "Return the current interval list",
    detail: "getIntervals returns " + formatRanges(intervals) + ".",
    activeLines: [24, 25],
    result: intervals,
  });

  return { frames };
}

export function formatRange(range: SummaryRange) {
  return "[" + range[0] + ", " + range[1] + "]";
}

export function formatRanges(ranges: SummaryRange[]) {
  return "[" + ranges.map(formatRange).join(", ") + "]";
}
