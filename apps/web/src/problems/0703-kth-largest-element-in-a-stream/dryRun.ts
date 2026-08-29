import type { NumericHeapEntry } from "../../shared/components/NumericHeapVisualizer";
import type { FrameKind } from "../../shared/types";

export type KthLargestStreamFrame = {
  kind: FrameKind;
  phase: "initialize" | "heapify" | "trim" | "add" | "answer" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  heap: number[];
  sourceIndex: number | null;
  current: number | null;
  popped: number | null;
  answers: number[];
  result: number[] | null;
};

export function createKthLargestStreamDryRun(k: number, nums: number[], adds: number[]): { frames: KthLargestStreamFrame[] } {
  const frames: KthLargestStreamFrame[] = [];
  const heap = [...nums];
  const answers: number[] = [];
  const push = (frame: Omit<KthLargestStreamFrame, "heap" | "answers">) => frames.push({ ...frame, heap: ordered(heap), answers: [...answers] });
  push({ kind: "start", phase: "initialize", title: "Store the starting values", detail: `self.k = ${k}; self.heap begins as nums.`, activeLines: [2, 3, 4], sourceIndex: null, current: null, popped: null, result: null });
  push({ kind: "build", phase: "heapify", title: "Heapify nums", detail: "heapq.heapify makes the smallest value the root of the min-heap.", activeLines: [5], sourceIndex: null, current: null, popped: null, result: null });
  while (heap.length > k) {
    const popped = ordered(heap)[0]!;
    heap.splice(heap.indexOf(popped), 1);
    push({ kind: "prune", phase: "trim", title: `Trim ${popped}`, detail: `The heap is larger than k = ${k}, so remove its smallest value.`, activeLines: [6, 7], sourceIndex: null, current: null, popped, result: null });
  }
  adds.forEach((value, index) => {
    heap.push(value);
    push({ kind: "build", phase: "add", title: `add(${value})`, detail: `Push ${value} into the min-heap.`, activeLines: [8, 9], sourceIndex: nums.length + index, current: value, popped: null, result: null });
    if (heap.length > k) {
      const popped = ordered(heap)[0]!;
      heap.splice(heap.indexOf(popped), 1);
      push({ kind: "prune", phase: "trim", title: `Trim ${popped}`, detail: "The extra smallest value cannot affect the kth largest answer.", activeLines: [10, 11], sourceIndex: nums.length + index, current: value, popped, result: null });
    }
    const answer = ordered(heap)[0]!;
    answers.push(answer);
    push({ kind: "found", phase: "answer", title: `Return ${answer}`, detail: "The min-heap root is the current kth largest value.", activeLines: [12], sourceIndex: nums.length + index, current: value, popped: null, result: [...answers] });
  });
  push({ kind: "done", phase: "done", title: "All add calls complete", detail: "Each returned value is listed in call order.", activeLines: [12], sourceIndex: null, current: null, popped: null, result: [...answers] });
  return { frames };
}

export function kthLargestStreamHeapEntries(heap: number[]): NumericHeapEntry[] {
  return ordered(heap).map((value) => ({ label: String(value), priority: value, detail: `value = ${value}` }));
}

function ordered(values: number[]) {
  return [...values].sort((left, right) => left - right);
}
