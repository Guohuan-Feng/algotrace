import type { ArrayTraceFrame } from "../../shared/components/ArrayTraceVisualizer";

export type KClosestFrame = ArrayTraceFrame & { phase: "start" | "compare" | "remove" | "done"; left: number; right: number; leftDistance: number | null; rightDistance: number | null };

export function createKClosestDryRun(arr: number[], k: number, x: number): { frames: KClosestFrame[] } {
  const frames: KClosestFrame[] = [];
  let left = 0, right = arr.length - 1;
  let leftDistance: number | null = null;
  let rightDistance: number | null = null;
  const push = (frame: Omit<KClosestFrame, "cells" | "activeIndices" | "completeIndices" | "left" | "right" | "leftDistance" | "rightDistance">) => frames.push({ ...frame, cells: arr, activeIndices: left <= right ? [left, right] : [], completeIndices: arr.map((_, index) => index).filter((index) => index < left || index > right), left, right, leftDistance, rightDistance });
  push({ kind: "start", phase: "start", title: "Keep the full sorted window", detail: `Remove endpoints until exactly ${k} elements remain.`, activeLines: [3, 4], result: null });
  while (right - left + 1 > k) {
    leftDistance = x - arr[left]!;
    rightDistance = arr[right]! - x;
    push({ kind: "visit", phase: "compare", title: `Compare endpoints ${arr[left]} and ${arr[right]}`, detail: `Distances from ${x}: left ${leftDistance}, right ${rightDistance}.`, activeLines: [4, 5], result: null });
    if (leftDistance <= rightDistance) {
      const removed = arr[right]!;
      right -= 1;
      push({ kind: "prune", phase: "remove", title: `Remove farther right endpoint ${removed}`, detail: "On ties, keep the smaller left value and discard the right endpoint.", activeLines: [5, 6], result: null });
    } else {
      const removed = arr[left]!;
      left += 1;
      push({ kind: "prune", phase: "remove", title: `Remove farther left endpoint ${removed}`, detail: "The left endpoint is farther from x, so discard it.", activeLines: [7, 8], result: null });
    }
  }
  push({ kind: "done", phase: "done", title: "Return the remaining window", detail: "The retained interval is already sorted and has exactly k closest elements.", activeLines: [9], result: arr.slice(left, right + 1) });
  return { frames };
}
