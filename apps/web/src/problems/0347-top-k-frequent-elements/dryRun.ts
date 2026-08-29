import type { FrameKind } from "../../shared/types";

type Entry = { value: number; frequency: number };
export type TopKFrequentFrame = { kind: FrameKind; phase: "start" | "count" | "push" | "pop" | "done"; title: string; detail: string; activeLines: number[]; index: number | null; current: number | null; counts: Record<string, number>; heap: Entry[]; removed: Entry | null; result: number[] | null };

export function createTopKFrequentDryRun(nums: number[], k: number): { frames: TopKFrequentFrame[] } {
  const frames: TopKFrequentFrame[] = []; const count = new Map<number, number>(); const heap: Entry[] = [];
  const snapshotHeap = () => [...heap].sort((left, right) => left.frequency - right.frequency || left.value - right.value);
  const push = (frame: Omit<TopKFrequentFrame, "counts" | "heap">) => frames.push({ ...frame, counts: Object.fromEntries([...count.entries()].map(([value, frequency]) => [String(value), frequency])), heap: snapshotHeap() });
  push({ kind: "start", phase: "start", title: "Count each number", detail: "First convert the input array into a frequency table.", activeLines: [3, 4], index: null, current: null, removed: null, result: null });
  nums.forEach((value, index) => { const frequency = (count.get(value) ?? 0) + 1; count.set(value, frequency); push({ kind: "build", phase: "count", title: `count[${value}] = ${frequency}`, detail: `Read nums[${index}] and increment its frequency.`, activeLines: [3], index, current: value, removed: null, result: null }); });
  [...count.entries()].forEach(([value, frequency]) => { const entry = { value, frequency }; heap.push(entry); push({ kind: "build", phase: "push", title: `Push (${frequency}, ${value})`, detail: "The min-heap root is the least frequent currently retained candidate.", activeLines: [6, 7], index: null, current: value, removed: null, result: null }); if (heap.length > k) { const sorted = snapshotHeap(); const removed = sorted[0]!; heap.splice(heap.findIndex((candidate) => candidate.value === removed.value), 1); push({ kind: "prune", phase: "pop", title: `Remove low frequency ${removed.value}`, detail: `Heap size exceeded k = ${k}, so (${removed.frequency}, ${removed.value}) cannot stay in the answer.`, activeLines: [8, 9], index: null, current: value, removed, result: null }); } });
  const result = snapshotHeap().sort((left, right) => right.frequency - left.frequency || left.value - right.value).map((entry) => entry.value);
  push({ kind: "done", phase: "done", title: `Return [${result.join(", ")}]`, detail: "The heap now contains exactly the k most frequent values.", activeLines: [11], index: null, current: null, removed: null, result });
  return { frames };
}
