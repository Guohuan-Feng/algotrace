import type { FrameKind } from "../../shared/types";

export type MinimumSide = "right" | "leftIncludingMid" | null;

export type FindMinimumRotatedFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  nums: number[];
  left: number;
  right: number;
  mid: number | null;
  minimumSide: MinimumSide;
  candidateRange: [number, number] | null;
  discardedRange: [number, number] | null;
  resultIndex: number | null;
  result: number | null;
};

export function createFindMinimumRotatedDryRun(nums: number[]): { frames: FindMinimumRotatedFrame[] } {
  const frames: FindMinimumRotatedFrame[] = [];
  let left = 0;
  let right = nums.length - 1;

  const push = (frame: Omit<FindMinimumRotatedFrame, "nums">) => {
    frames.push({ ...frame, nums: [...nums] });
  };

  push({
    kind: "start",
    title: "Initialize pointers",
    detail: `left = 0, right = ${right}. The minimum must be inside this window.`,
    activeLines: [5, 6],
    left,
    right,
    mid: null,
    minimumSide: null,
    candidateRange: [left, right],
    discardedRange: null,
    resultIndex: null,
    result: null,
  });

  while (left < right) {
    push({
      kind: "visit",
      title: "Check window",
      detail: `Continue while left < right: ${left} < ${right}.`,
      activeLines: [8],
      left,
      right,
      mid: null,
      minimumSide: null,
      candidateRange: [left, right],
      discardedRange: null,
      resultIndex: null,
      result: null,
    });

    const mid = left + Math.floor((right - left) / 2);
    push({
      kind: "visit",
      title: `Compute mid = ${mid}`,
      detail: `Compare nums[mid] = ${nums[mid]} with nums[right] = ${nums[right]}.`,
      activeLines: [9, 11],
      left,
      right,
      mid,
      minimumSide: null,
      candidateRange: [left, right],
      discardedRange: null,
      resultIndex: null,
      result: null,
    });

    if (nums[mid] > nums[right]) {
      const oldLeft = left;
      left = mid + 1;
      push({
        kind: "prune",
        title: "Minimum is to the right",
        detail: `${nums[mid]} > ${nums[right]}, so mid is in the larger left segment. Discard [${oldLeft}, ${mid}] and move left to ${left}.`,
        activeLines: [11, 12, 13, 14],
        left,
        right,
        mid,
        minimumSide: "right",
        candidateRange: [left, right],
        discardedRange: [oldLeft, mid],
        resultIndex: null,
        result: null,
      });
    } else {
      const oldRight = right;
      right = mid;
      push({
        kind: "build",
        title: "Minimum is left, including mid",
        detail: `${nums[mid]} <= ${nums[oldRight]}, so mid may be the minimum. Keep [${left}, ${mid}] and move right to ${right}.`,
        activeLines: [15, 16, 17, 18, 19],
        left,
        right,
        mid,
        minimumSide: "leftIncludingMid",
        candidateRange: [left, right],
        discardedRange: mid + 1 <= oldRight ? [mid + 1, oldRight] : null,
        resultIndex: null,
        result: null,
      });
    }
  }

  push({
    kind: "found",
    title: "Minimum found",
    detail: `left == right == ${left}. Return nums[left] = ${nums[left]}.`,
    activeLines: [8, 21],
    left,
    right,
    mid: null,
    minimumSide: null,
    candidateRange: [left, right],
    discardedRange: null,
    resultIndex: left,
    result: nums[left],
  });

  return { frames };
}
