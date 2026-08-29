import type { FrameKind } from "../../shared/types";

type HeapEntry = [number, string];

export type ReorganizeStringFrame = {
  kind: FrameKind;
  phase: "initialize" | "pop" | "append" | "restore-previous" | "hold" | "impossible" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  heap: HeapEntry[];
  ans: string[];
  prev: HeapEntry | null;
  current: HeapEntry | null;
  result: string | null;
};

const orderHeap = (heap: HeapEntry[]) => [...heap].sort((left, right) => left[0] - right[0] || left[1].localeCompare(right[1]));

export function createReorganizeStringDryRun(s: string): { frames: ReorganizeStringFrame[] } {
  const count = new Map<string, number>();
  [...s].forEach((char) => count.set(char, (count.get(char) ?? 0) + 1));
  const heap: HeapEntry[] = [];
  const ans: string[] = [];
  const frames: ReorganizeStringFrame[] = [];
  let prevFreq = 0;
  let prevChar = "";
  const push = (frame: Omit<ReorganizeStringFrame, "heap" | "ans" | "prev">) => frames.push({ ...frame, heap: orderHeap(heap), ans: [...ans], prev: prevFreq < 0 ? [prevFreq, prevChar] : null });

  push({ kind: "start", phase: "initialize", title: "Count characters", detail: `Counter(s) = ${JSON.stringify(Object.fromEntries(count))}.`, activeLines: [2, 3], current: null, result: null });
  for (const [char, freq] of count) heap.push([-freq, char]);
  push({ kind: "build", phase: "initialize", title: "Build the max-heap", detail: "Every heap entry is (-frequency, character).", activeLines: [5, 7, 8], current: null, result: null });

  while (heap.length) {
    const [freq, char] = orderHeap(heap).shift()!;
    heap.splice(heap.findIndex(([entryFreq, entryChar]) => entryFreq === freq && entryChar === char), 1);
    push({ kind: "visit", phase: "pop", title: `Pop ${char}`, detail: `${char} has the largest remaining count; the previous character is held outside the heap.`, activeLines: [14, 15], current: [freq, char], result: null });
    ans.push(char);
    const nextFreq = freq + 1;
    push({ kind: "build", phase: "append", title: `Append ${char}`, detail: `Use one ${char}; its negative frequency changes from ${freq} to ${nextFreq}.`, activeLines: [17, 18], current: [nextFreq, char], result: null });
    if (prevFreq < 0) {
      heap.push([prevFreq, prevChar]);
      push({ kind: "backtrack", phase: "restore-previous", title: `Return ${prevChar} to heap`, detail: `A different character was appended, so the held ${prevChar} is eligible again.`, activeLines: [20, 21], current: [nextFreq, char], result: null });
    }
    prevFreq = nextFreq;
    prevChar = char;
    push({ kind: "visit", phase: "hold", title: `Hold ${char} as prev`, detail: "Keep the just-used character out of the heap for one iteration to prevent adjacent duplicates.", activeLines: [23, 24], current: [nextFreq, char], result: null });
  }

  if (prevFreq < 0) {
    push({ kind: "prune", phase: "impossible", title: `Unplaceable ${prevChar} remains`, detail: "The heap is empty but the held character still has copies, so return an empty string.", activeLines: [26, 27], current: null, result: "" });
    return { frames };
  }
  push({ kind: "done", phase: "done", title: "Return the reorganized string", detail: `Join the answer: ${ans.join("")}.`, activeLines: [29], current: null, result: ans.join("") });
  return { frames };
}
