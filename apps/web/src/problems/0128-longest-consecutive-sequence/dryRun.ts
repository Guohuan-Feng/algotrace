import type { FrameKind } from "../../shared/types";

export type LongestConsecutiveFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  nums: number[];
  setValues: number[];
  currentNum: number | null;
  currentRun: number[];
  skipped: number[];
  res: number;
};

export function createLongestConsecutiveDryRun(nums: number[]): { frames: LongestConsecutiveFrame[] } {
  const frames: LongestConsecutiveFrame[] = [];
  const numSet = new Set(nums);
  const setValues = [...numSet].sort((a, b) => a - b);
  let res = 0;
  const skipped = new Set<number>();

  const push = (frame: Omit<LongestConsecutiveFrame, "nums" | "setValues" | "skipped" | "res">) => {
    frames.push({ ...frame, nums: [...nums], setValues, skipped: [...skipped], res });
  };

  push({
    kind: "build",
    title: "Build num_set",
    detail: `Remove duplicates with set(nums). Unique values: ${setValues.length}.`,
    activeLines: [5, 6],
    currentNum: null,
    currentRun: [],
  });

  for (const num of setValues) {
    push({
      kind: "visit",
      title: `Check ${num}`,
      detail: `Only start counting when ${num} - 1 is not in num_set.`,
      activeLines: [8, 10],
      currentNum: num,
      currentRun: [num],
    });

    if (numSet.has(num - 1)) {
      skipped.add(num);
      push({
        kind: "prune",
        title: `${num} is not a start`,
        detail: `${num - 1} exists, so ${num} belongs to a sequence that started earlier.`,
        activeLines: [10],
        currentNum: num,
        currentRun: [],
      });
      continue;
    }

    let cur = num;
    let length = 1;
    const run = [num];
    push({
      kind: "start",
      title: `Start sequence at ${num}`,
      detail: `cur = ${cur}, length = ${length}.`,
      activeLines: [11, 12],
      currentNum: num,
      currentRun: [...run],
    });

    while (numSet.has(cur + 1)) {
      push({
        kind: "visit",
        title: `${cur + 1} exists`,
        detail: `cur + 1 = ${cur + 1} is in num_set, extend this sequence.`,
        activeLines: [14],
        currentNum: cur + 1,
        currentRun: [...run],
      });
      cur += 1;
      length += 1;
      run.push(cur);
      push({
        kind: "build",
        title: `Extend to ${cur}`,
        detail: `cur = ${cur}, length = ${length}.`,
        activeLines: [15, 16],
        currentNum: cur,
        currentRun: [...run],
      });
    }

    res = Math.max(res, length);
    push({
      kind: "found",
      title: `Sequence length ${length}`,
      detail: `Update res = max(res, ${length}) = ${res}.`,
      activeLines: [18],
      currentNum: num,
      currentRun: [...run],
    });
  }

  push({
    kind: "done",
    title: "Return result",
    detail: `Longest consecutive sequence length is ${res}.`,
    activeLines: [20],
    currentNum: null,
    currentRun: [],
  });

  return { frames };
}
