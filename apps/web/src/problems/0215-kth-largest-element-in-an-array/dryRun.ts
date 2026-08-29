import type { NumericHeapEntry } from "../../shared/components/NumericHeapVisualizer";
import type { FrameKind } from "../../shared/types";

export type KthLargestFrame = {
  kind: FrameKind;
  phase: "initialize" | "push" | "pop-excess" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  heap: number[];
  sourceIndex: number | null;
  current: number | null;
  popped: number | null;
  result: number | null;
};

export function createKthLargestDryRun(nums: number[], k: number): { frames: KthLargestFrame[] } {
  const frames: KthLargestFrame[] = [];
  const heap: number[] = [];
  const push = (frame: Omit<KthLargestFrame, "heap">) => frames.push({ ...frame, heap: ordered(heap) });

  push({ kind: "start", phase: "initialize", title: "Create an empty min-heap", detail: `The heap will retain exactly the ${k} largest values seen so far.`, activeLines: [2, 3], sourceIndex: null, current: null, popped: null, result: null });
  nums.forEach((num, sourceIndex) => {
    heap.push(num);
    push({ kind: "build", phase: "push", title: `Push ${num}`, detail: `heapq.heappush(heap, ${num}) keeps the smallest retained value at the root.`, activeLines: [4, 5], sourceIndex, current: num, popped: null, result: null });
    if (heap.length > k) {
      const popped = ordered(heap)[0]!;
      heap.splice(heap.indexOf(popped), 1);
      push({ kind: "prune", phase: "pop-excess", title: `Pop ${popped}`, detail: `len(heap) is ${k + 1}, so discard its smallest value. The remaining values are the best ${k} candidates.`, activeLines: [6, 7], sourceIndex, current: num, popped, result: null });
    }
  });
  const result = ordered(heap)[0] ?? null;
  push({ kind: "done", phase: "done", title: `Return ${result}`, detail: "The min-heap root is the kth largest number because exactly k largest values remain.", activeLines: [8], sourceIndex: null, current: null, popped: null, result });
  return { frames };
}

export function kthLargestHeapEntries(heap: number[]): NumericHeapEntry[] {
  return ordered(heap).map((value) => ({ label: String(value), priority: value, detail: `value = ${value}` }));
}

function ordered(values: number[]) {
  return [...values].sort((left, right) => left - right);
}
