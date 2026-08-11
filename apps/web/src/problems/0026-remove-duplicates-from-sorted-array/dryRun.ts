import type { FrameKind } from "../../shared/types";

export type RemoveDuplicatesFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  nums: number[];
  original: number[];
  slow: number;
  fast: number | null;
  compareIndex: number | null;
  writeIndex: number | null;
  prefixLength: number;
  result: {
    k: number | null;
    nums: number[];
  };
};

export function createRemoveDuplicatesDryRun(input: number[]): { frames: RemoveDuplicatesFrame[] } {
  const frames: RemoveDuplicatesFrame[] = [];
  const nums = [...input];
  let slow = 1;
  let lastWriteIndex: number | null = null;

  const push = (
    frame: Omit<RemoveDuplicatesFrame, "nums" | "original" | "prefixLength" | "result"> & {
      resultK?: number | null;
    },
  ) => {
    frames.push({
      ...frame,
      nums: [...nums],
      original: [...input],
      prefixLength: Math.min(slow, nums.length),
      result: {
        k: frame.resultK ?? null,
        nums: nums.slice(0, frame.resultK ?? slow),
      },
    });
  };

  push({
    kind: "start",
    title: "Initialize slow",
    detail: "The first sorted value is always unique, so slow starts at 1.",
    activeLines: [3],
    slow,
    fast: null,
    compareIndex: null,
    writeIndex: null,
  });

  for (let fast = 1; fast < nums.length; fast += 1) {
    lastWriteIndex = null;
    push({
      kind: "visit",
      title: `Read nums[${fast}]`,
      detail: `fast scans value ${nums[fast]} and compares it with nums[${fast - 1}] = ${nums[fast - 1]}.`,
      activeLines: [5],
      slow,
      fast,
      compareIndex: fast - 1,
      writeIndex: null,
    });

    if (nums[fast] !== nums[fast - 1]) {
      push({
        kind: "visit",
        title: "New unique value",
        detail: `${nums[fast]} is different from ${nums[fast - 1]}, so write it into the slow position.`,
        activeLines: [6],
        slow,
        fast,
        compareIndex: fast - 1,
        writeIndex: slow,
      });

      nums[slow] = nums[fast];
      lastWriteIndex = slow;
      push({
        kind: "build",
        title: `Write ${nums[fast]} to index ${slow}`,
        detail: `nums[${slow}] = nums[${fast}]. The valid prefix becomes ${JSON.stringify(nums.slice(0, slow + 1))}.`,
        activeLines: [7],
        slow,
        fast,
        compareIndex: fast - 1,
        writeIndex: slow,
      });

      slow += 1;
      push({
        kind: "build",
        title: "Move slow",
        detail: `slow moves to ${slow}, the next write position.`,
        activeLines: [8],
        slow,
        fast,
        compareIndex: fast - 1,
        writeIndex: lastWriteIndex,
      });
    } else {
      push({
        kind: "prune",
        title: "Duplicate, skip",
        detail: `${nums[fast]} equals the previous sorted value, so fast moves on and slow stays at ${slow}.`,
        activeLines: [6],
        slow,
        fast,
        compareIndex: fast - 1,
        writeIndex: null,
      });
    }
  }

  frames.push({
    kind: "done",
    title: "Return slow",
    detail: `Return k = ${slow}. Only nums[0:${slow}] matters; the rest can be ignored.`,
    activeLines: [10],
    nums: [...nums],
    original: [...input],
    slow,
    fast: null,
    compareIndex: null,
    writeIndex: null,
    prefixLength: slow,
    result: {
      k: slow,
      nums: nums.slice(0, slow),
    },
  });

  return { frames };
}
