import type { ArrayTraceFrame } from "../../shared/components/ArrayTraceVisualizer";

export type SubarraySumFrame = ArrayTraceFrame & { phase: "start" | "prefix" | "count" | "store" | "done"; total: number; needed: number; count: number; prefixEntries: Array<[number, number]> };

export function createSubarraySumDryRun(nums: number[], k: number): { frames: SubarraySumFrame[] } {
  const frames: SubarraySumFrame[] = [];
  const prefixCount = new Map<number, number>([[0, 1]]);
  let total = 0, count = 0, needed = -k, index = -1;
  const push = (frame: Omit<SubarraySumFrame, "cells" | "activeIndices" | "completeIndices" | "total" | "needed" | "count" | "prefixEntries">) => frames.push({ ...frame, cells: nums, activeIndices: index >= 0 ? [index] : [], completeIndices: Array.from({ length: Math.max(index, 0) }, (_, current) => current), total, needed, count, prefixEntries: [...prefixCount.entries()] });
  push({ kind: "start", phase: "start", title: "Seed prefix sum 0", detail: "The empty prefix appears once, so a prefix sum equal to k can form a valid subarray from index 0.", activeLines: [3, 4], result: null });
  nums.forEach((num, current) => {
    index = current;
    total += num;
    needed = total - k;
    push({ kind: "visit", phase: "prefix", title: `Add ${num}: prefix sum = ${total}`, detail: `A previous prefix sum ${needed} would leave a subarray sum of ${k}.`, activeLines: [5, 6], result: null });
    const matches = prefixCount.get(needed) ?? 0;
    count += matches;
    push({ kind: matches ? "found" : "visit", phase: "count", title: `Find ${matches} matching prefix${matches === 1 ? "" : "es"}`, detail: `Count becomes ${count} after adding all prefixes equal to ${needed}.`, activeLines: [7], result: null });
    prefixCount.set(total, (prefixCount.get(total) ?? 0) + 1);
    push({ kind: "build", phase: "store", title: `Store prefix sum ${total}`, detail: "Future positions can now use this prefix as a valid left boundary.", activeLines: [8], result: null });
  });
  index = -1;
  push({ kind: "done", phase: "done", title: `Return ${count}`, detail: "Every ending index has counted its valid starting prefixes.", activeLines: [9], result: count });
  return { frames };
}
