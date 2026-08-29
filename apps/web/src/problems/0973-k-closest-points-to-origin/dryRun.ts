import type { NumericHeapEntry } from "../../shared/components/NumericHeapVisualizer";
import type { FrameKind } from "../../shared/types";

type HeapPoint = { distance: number; point: [number, number] };

export type KClosestFrame = {
  kind: FrameKind;
  phase: "initialize" | "distance" | "push" | "pop-farthest" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  heap: HeapPoint[];
  sourceIndex: number | null;
  current: [number, number] | null;
  popped: [number, number] | null;
  result: number[][] | null;
};

export function createKClosestDryRun(points: number[][], k: number): { frames: KClosestFrame[] } {
  const frames: KClosestFrame[] = [];
  const heap: HeapPoint[] = [];
  const push = (frame: Omit<KClosestFrame, "heap">) => frames.push({ ...frame, heap: ordered(heap) });
  push({ kind: "start", phase: "initialize", title: "Create an empty max-heap", detail: "Store each distance as a negative priority so Python's min-heap pops the farthest point first.", activeLines: [2, 3], sourceIndex: null, current: null, popped: null, result: null });
  points.forEach((rawPoint, sourceIndex) => {
    const point: [number, number] = [rawPoint[0]!, rawPoint[1]!];
    const distance = point[0] * point[0] + point[1] * point[1];
    push({ kind: "visit", phase: "distance", title: `Distance for ${pointLabel(point)}`, detail: `${point[0]}² + ${point[1]}² = ${distance}.`, activeLines: [4, 5], sourceIndex, current: point, popped: null, result: null });
    heap.push({ point, distance });
    push({ kind: "build", phase: "push", title: `Push ${pointLabel(point)}`, detail: `Push (-${distance}, ${point[0]}, ${point[1]}). The most negative priority is the farthest point.`, activeLines: [6], sourceIndex, current: point, popped: null, result: null });
    if (heap.length > k) {
      const farthest = ordered(heap)[0]!;
      heap.splice(heap.findIndex((entry) => entry.point === farthest.point), 1);
      push({ kind: "prune", phase: "pop-farthest", title: `Discard ${pointLabel(farthest.point)}`, detail: `The heap exceeds k = ${k}, so pop the farthest retained point (distance ${farthest.distance}).`, activeLines: [7, 8], sourceIndex, current: point, popped: farthest.point, result: null });
    }
  });
  const result = [...heap].sort((left, right) => left.distance - right.distance || left.point[0] - right.point[0]).map((entry) => [...entry.point]);
  push({ kind: "done", phase: "done", title: "Return the retained points", detail: "Every remaining heap entry is among the k closest points to the origin.", activeLines: [9], sourceIndex: null, current: null, popped: null, result });
  return { frames };
}

export function kClosestHeapEntries(heap: HeapPoint[]): NumericHeapEntry[] {
  return ordered(heap).map((entry) => ({ label: pointLabel(entry.point), priority: -entry.distance, detail: `-distance = ${-entry.distance}` }));
}

function ordered(heap: HeapPoint[]) {
  return [...heap].sort((left, right) => right.distance - left.distance || left.point[0] - right.point[0] || left.point[1] - right.point[1]);
}

export function pointLabel(point: [number, number]) {
  return `(${point[0]}, ${point[1]})`;
}
