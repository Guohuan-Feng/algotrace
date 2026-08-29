import type { FrameKind } from "../../shared/types";

export type SortColorsFrame = {
  kind: FrameKind;
  phase: "initialize" | "inspect" | "swap-zero" | "keep-one" | "swap-two" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  nums: number[];
  low: number;
  mid: number;
  high: number;
  compared: number | null;
  swapped: [number, number] | null;
  result: number[] | null;
};

export function createSortColorsDryRun(input: number[]): { frames: SortColorsFrame[] } {
  const frames: SortColorsFrame[] = [];
  const nums = [...input];
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;
  const snapshot = (frame: Omit<SortColorsFrame, "nums" | "low" | "mid" | "high">) => { frames.push({ ...frame, nums: [...nums], low, mid, high }); };

  snapshot({ kind: "start", phase: "initialize", title: "Split into zero, unknown, and two regions", detail: "low marks where the next 0 belongs, mid scans unknown values, and high marks where the next 2 belongs.", activeLines: [2, 3], compared: null, swapped: null, result: null });
  while (mid <= high) {
    const value = nums[mid]!;
    snapshot({ kind: "visit", phase: "inspect", title: "Inspect nums[" + mid + "] = " + value, detail: "Only the middle index is unknown. Choose the matching branch for color " + value + ".", activeLines: [5, 6], compared: mid, swapped: null, result: null });
    if (value === 0) {
      const before = [low, mid] as [number, number];
      [nums[low], nums[mid]] = [nums[mid]!, nums[low]!];
      low += 1;
      mid += 1;
      snapshot({ kind: "build", phase: "swap-zero", title: "Place 0 at the left boundary", detail: "Swap indices " + before[0] + " and " + before[1] + ", then advance low and mid. The left 0-region grows by one.", activeLines: [7, 8, 9], compared: before[1], swapped: before, result: null });
    } else if (value === 1) {
      mid += 1;
      snapshot({ kind: "build", phase: "keep-one", title: "Keep 1 in the middle region", detail: "A 1 belongs between the 0s and 2s, so only mid advances to " + mid + ".", activeLines: [10, 11], compared: mid - 1, swapped: null, result: null });
    } else {
      const before = [mid, high] as [number, number];
      [nums[mid], nums[high]] = [nums[high]!, nums[mid]!];
      high -= 1;
      snapshot({ kind: "build", phase: "swap-two", title: "Place 2 at the right boundary", detail: "Swap indices " + before[0] + " and " + before[1] + ", then shrink high. Do not advance mid because the swapped-in value is still unknown.", activeLines: [13, 14], compared: mid, swapped: before, result: null });
    }
  }
  snapshot({ kind: "done", phase: "done", title: "All colors are partitioned", detail: "The unknown region is empty, so nums is ordered as 0s, then 1s, then 2s.", activeLines: [16], compared: null, swapped: null, result: [...nums] });
  return { frames };
}
