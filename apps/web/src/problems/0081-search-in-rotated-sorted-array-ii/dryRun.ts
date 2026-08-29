import type { FrameKind } from "../../shared/types";

export type RotatedSearchIiFrame = {
  kind: FrameKind;
  phase: "initialize" | "inspect" | "deduplicate" | "left-sorted" | "right-sorted" | "found" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  nums: number[];
  target: number;
  left: number;
  mid: number | null;
  right: number;
  sortedHalf: "left" | "right" | null;
  targetRange: [number, number] | null;
  result: boolean | null;
};

export function createRotatedSearchIiDryRun(nums: number[], target: number): { frames: RotatedSearchIiFrame[] } {
  const frames: RotatedSearchIiFrame[] = [];
  let left = 0;
  let right = nums.length - 1;
  const snapshot = (frame: Omit<RotatedSearchIiFrame, "nums" | "target" | "left" | "right">) => { frames.push({ ...frame, nums: [...nums], target, left, right }); };
  snapshot({ kind: "start", phase: "initialize", title: "Initialize a closed search window", detail: "Search for " + target + " between indices 0 and " + right + ". Duplicates may temporarily hide the sorted half.", activeLines: [2, 3], mid: null, sortedHalf: null, targetRange: null, result: null });
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    snapshot({ kind: "visit", phase: "inspect", title: "Check mid = " + mid + " (value " + nums[mid] + ")", detail: "Compare the endpoints " + nums[left] + ", " + nums[mid] + ", and " + nums[right] + " to locate a sorted half.", activeLines: [5, 6], mid, sortedHalf: null, targetRange: null, result: null });
    if (nums[mid] === target) {
      snapshot({ kind: "found", phase: "found", title: "Target found at index " + mid, detail: "nums[mid] equals " + target + ", so return True.", activeLines: [7, 8], mid, sortedHalf: null, targetRange: [mid, mid], result: true });
      return { frames };
    }
    if (nums[left] === nums[mid] && nums[mid] === nums[right]) {
      left += 1;
      right -= 1;
      snapshot({ kind: "prune", phase: "deduplicate", title: "Equal endpoints hide the pivot", detail: "left, mid, and right all show " + nums[mid] + ". Neither side is provably sorted, so discard just the duplicate endpoints.", activeLines: [10, 11, 12], mid, sortedHalf: null, targetRange: null, result: null });
    } else if (nums[left]! <= nums[mid]!) {
      const range: [number, number] = [left, mid];
      snapshot({ kind: "visit", phase: "left-sorted", title: "Left half is sorted", detail: "nums[left] <= nums[mid], so indices " + left + " through " + mid + " are ordered.", activeLines: [13, 14], mid, sortedHalf: "left", targetRange: range, result: null });
      if (nums[left]! <= target && target < nums[mid]!) {
        right = mid - 1;
        snapshot({ kind: "build", phase: "left-sorted", title: "Keep the target in the left half", detail: target + " lies in [" + nums[left] + ", " + nums[mid] + "), so move right to " + right + ".", activeLines: [15, 16], mid, sortedHalf: "left", targetRange: range, result: null });
      } else {
        left = mid + 1;
        snapshot({ kind: "prune", phase: "left-sorted", title: "Discard the sorted left half", detail: target + " is outside [" + nums[range[0]] + ", " + nums[mid] + "), so move left to " + left + ".", activeLines: [17, 18], mid, sortedHalf: "left", targetRange: range, result: null });
      }
    } else {
      const range: [number, number] = [mid, right];
      snapshot({ kind: "visit", phase: "right-sorted", title: "Right half is sorted", detail: "The rotation lies left of mid, so indices " + mid + " through " + right + " are ordered.", activeLines: [20, 21], mid, sortedHalf: "right", targetRange: range, result: null });
      if (nums[mid]! < target && target <= nums[right]!) {
        left = mid + 1;
        snapshot({ kind: "build", phase: "right-sorted", title: "Keep the target in the right half", detail: target + " lies in (" + nums[mid] + ", " + nums[right] + "], so move left to " + left + ".", activeLines: [22, 23], mid, sortedHalf: "right", targetRange: range, result: null });
      } else {
        right = mid - 1;
        snapshot({ kind: "prune", phase: "right-sorted", title: "Discard the sorted right half", detail: target + " is outside (" + nums[mid] + ", " + nums[range[1]] + "], so move right to " + right + ".", activeLines: [24, 25], mid, sortedHalf: "right", targetRange: range, result: null });
      }
    }
  }
  snapshot({ kind: "done", phase: "done", title: "Search window is empty", detail: "No index can contain " + target + ". Return False.", activeLines: [27], mid: null, sortedHalf: null, targetRange: null, result: false });
  return { frames };
}
