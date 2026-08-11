import type { FrameKind } from "../../shared/types";

export type SortedHalf = "left" | "right" | null;

export type SearchRotatedFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  nums: number[];
  target: number;
  left: number;
  right: number;
  mid: number | null;
  sortedHalf: SortedHalf;
  targetRange: [number, number] | null;
  result: number | null;
};

export function createSearchRotatedDryRun(nums: number[], target: number): { frames: SearchRotatedFrame[] } {
  const frames: SearchRotatedFrame[] = [];
  let left = 0;
  let right = nums.length - 1;

  const push = (frame: Omit<SearchRotatedFrame, "nums" | "target">) => {
    frames.push({ ...frame, nums: [...nums], target });
  };

  push({
    kind: "start",
    title: "Initialize pointers",
    detail: `left = 0, right = ${right}, target = ${target}.`,
    activeLines: [5, 6],
    left,
    right,
    mid: null,
    sortedHalf: null,
    targetRange: null,
    result: null,
  });

  while (left <= right) {
    push({
      kind: "visit",
      title: "Check search window",
      detail: `Search while left <= right: ${left} <= ${right}.`,
      activeLines: [8],
      left,
      right,
      mid: null,
      sortedHalf: null,
      targetRange: null,
      result: null,
    });

    const mid = left + Math.floor((right - left) / 2);
    push({
      kind: "visit",
      title: `Compute mid = ${mid}`,
      detail: `nums[mid] = ${nums[mid]}. Compare it with target ${target}.`,
      activeLines: [9, 11],
      left,
      right,
      mid,
      sortedHalf: null,
      targetRange: null,
      result: null,
    });

    if (nums[mid] === target) {
      push({
        kind: "found",
        title: "Target found",
        detail: `nums[${mid}] == ${target}, return ${mid}.`,
        activeLines: [11, 12],
        left,
        right,
        mid,
        sortedHalf: null,
        targetRange: [mid, mid],
        result: mid,
      });
      return { frames };
    }

    if (nums[left] <= nums[mid]) {
      push({
        kind: "visit",
        title: "Left half is sorted",
        detail: `nums[left] = ${nums[left]} <= nums[mid] = ${nums[mid]}, so [${left}, ${mid}] is ordered.`,
        activeLines: [14, 15],
        left,
        right,
        mid,
        sortedHalf: "left",
        targetRange: [left, mid],
        result: null,
      });

      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
        push({
          kind: "build",
          title: "Target stays on the left",
          detail: `${target} is in [${nums[left]}, ${nums[mid]}), move right to ${right}.`,
          activeLines: [16, 17, 18],
          left,
          right,
          mid,
          sortedHalf: "left",
          targetRange: [left, mid],
          result: null,
        });
      } else {
        left = mid + 1;
        push({
          kind: "prune",
          title: "Discard left half",
          detail: `${target} is not in [${nums[left - 1] ?? "?"}, ${nums[mid]}), move left to ${left}.`,
          activeLines: [19, 20],
          left,
          right,
          mid,
          sortedHalf: "left",
          targetRange: null,
          result: null,
        });
      }
    } else {
      push({
        kind: "visit",
        title: "Right half is sorted",
        detail: `nums[mid] = ${nums[mid]} < nums[right] = ${nums[right]}, so [${mid}, ${right}] is ordered.`,
        activeLines: [22, 23],
        left,
        right,
        mid,
        sortedHalf: "right",
        targetRange: [mid, right],
        result: null,
      });

      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
        push({
          kind: "build",
          title: "Target stays on the right",
          detail: `${target} is in (${nums[mid]}, ${nums[right]}], move left to ${left}.`,
          activeLines: [24, 25, 26],
          left,
          right,
          mid,
          sortedHalf: "right",
          targetRange: [mid, right],
          result: null,
        });
      } else {
        right = mid - 1;
        push({
          kind: "prune",
          title: "Discard right half",
          detail: `${target} is not in (${nums[mid]}, ${nums[right + 1] ?? "?"}], move right to ${right}.`,
          activeLines: [27, 28],
          left,
          right,
          mid,
          sortedHalf: "right",
          targetRange: null,
          result: null,
        });
      }
    }
  }

  push({
    kind: "done",
    title: "Target not found",
    detail: `left = ${left}, right = ${right}; the search window is empty, return -1.`,
    activeLines: [8, 30],
    left,
    right,
    mid: null,
    sortedHalf: null,
    targetRange: null,
    result: -1,
  });

  return { frames };
}
