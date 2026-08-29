import type { FrameKind } from "../../shared/types";

export type SearchInsertFrame = {
  kind: FrameKind;
  phase: "initialize" | "inspect" | "move-left" | "move-right" | "found" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  nums: number[];
  target: number;
  left: number;
  right: number;
  mid: number | null;
  result: number | null;
};

export function createSearchInsertDryRun(nums: number[], target: number): { frames: SearchInsertFrame[] } {
  const frames: SearchInsertFrame[] = [];
  let left = 0; let right = nums.length - 1;
  const snapshot = (frame: Omit<SearchInsertFrame, "nums" | "target" | "left" | "right">) => frames.push({ ...frame, nums: [...nums], target, left, right });
  snapshot({ kind: "start", phase: "initialize", title: "Initialize the closed interval", detail: "Search indices [0, " + right + "] for target " + target + ".", activeLines: [2], mid: null, result: null });
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    snapshot({ kind: "visit", phase: "inspect", title: "Inspect the middle value", detail: "mid = " + mid + "; nums[mid] = " + nums[mid] + ".", activeLines: [4, 5], mid, result: null });
    if (nums[mid] === target) {
      snapshot({ kind: "found", phase: "found", title: "Target already exists", detail: nums[mid] + " equals " + target + ", so return index " + mid + ".", activeLines: [6, 7], mid, result: mid });
      return { frames };
    }
    if (nums[mid]! < target) {
      left = mid + 1;
      snapshot({ kind: "build", phase: "move-left", title: "Discard the smaller half", detail: nums[mid] + " is below " + target + ", so every index through " + mid + " is too small.", activeLines: [8, 9], mid, result: null });
    } else {
      right = mid - 1;
      snapshot({ kind: "prune", phase: "move-right", title: "Keep the left insertion boundary", detail: nums[mid] + " is above " + target + ", so the insertion point is before " + mid + ".", activeLines: [10, 11], mid, result: null });
    }
  }
  snapshot({ kind: "done", phase: "done", title: "Return left as the insertion index", detail: "The pointers cross with right < left. left = " + left + " is the first position whose value is at least the target.", activeLines: [13], mid: null, result: left });
  return { frames };
}
