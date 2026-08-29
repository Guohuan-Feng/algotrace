import type { FrameKind } from "../../shared/types";

type HeapEntry = [number, string];

export type LongestHappyStringFrame = {
  kind: FrameKind;
  phase: "initialize" | "pop" | "append" | "fallback" | "restore" | "blocked" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  heap: HeapEntry[];
  ans: string[];
  first: HeapEntry | null;
  second: HeapEntry | null;
  result: string | null;
};

const orderHeap = (heap: HeapEntry[]) => [...heap].sort((left, right) => left[0] - right[0] || left[1].localeCompare(right[1]));

export function createLongestHappyStringDryRun(a: number, b: number, c: number): { frames: LongestHappyStringFrame[] } {
  const heap: HeapEntry[] = [];
  const ans: string[] = [];
  const frames: LongestHappyStringFrame[] = [];
  const push = (frame: Omit<LongestHappyStringFrame, "heap" | "ans">) => frames.push({ ...frame, heap: orderHeap(heap), ans: [...ans] });
  const add = (freq: number, char: string, line: number) => {
    if (freq > 0) {
      heap.push([-freq, char]);
      push({ kind: "build", phase: "initialize", title: `Push ${char} (${freq})`, detail: `Store ${-freq} in the min-heap to simulate a max-heap.`, activeLines: [line], first: null, second: null, result: null });
    }
  };

  push({ kind: "start", phase: "initialize", title: "Create max-heap", detail: "The heap stores negative frequencies so the most available character pops first.", activeLines: [2, 3], first: null, second: null, result: null });
  add(a, "a", 5); add(b, "b", 6); add(c, "c", 7);
  while (heap.length) {
    const [freq1, char1] = orderHeap(heap).shift()!;
    heap.splice(heap.findIndex(([freq, char]) => freq === freq1 && char === char1), 1);
    push({ kind: "visit", phase: "pop", title: `Pop ${char1} (${Math.abs(freq1)} left)`, detail: `${char1} currently has the largest remaining count.`, activeLines: [11, 12], first: [freq1, char1], second: null, result: null });
    const wouldTriple = ans.length >= 2 && ans[ans.length - 1] === char1 && ans[ans.length - 2] === char1;
    if (wouldTriple) {
      if (!heap.length) {
        push({ kind: "prune", phase: "blocked", title: `Stop before ${char1}${char1}${char1}`, detail: `No second character is available, so the remaining ${char1} cannot be appended.`, activeLines: [15, 16], first: [freq1, char1], second: null, result: ans.join("") });
        break;
      }
      const [freq2, char2] = orderHeap(heap).shift()!;
      heap.splice(heap.findIndex(([freq, char]) => freq === freq2 && char === char2), 1);
      ans.push(char2);
      push({ kind: "build", phase: "fallback", title: `Use ${char2} to break the triple`, detail: `${char1} would create three equal characters, so pop and append the second-best option ${char2}.`, activeLines: [19, 20], first: [freq1, char1], second: [freq2, char2], result: null });
      if (freq2 + 1 < 0) heap.push([freq2 + 1, char2]);
      heap.push([freq1, char1]);
      push({ kind: "backtrack", phase: "restore", title: "Restore remaining choices", detail: `Reinsert ${char1} unchanged and ${char2} only if it still has copies left.`, activeLines: [22, 23, 26], first: [freq1, char1], second: [freq2, char2], result: null });
    } else {
      ans.push(char1);
      push({ kind: "build", phase: "append", title: `Append ${char1}`, detail: `Appending ${char1} keeps the answer happy.`, activeLines: [28, 29], first: [freq1, char1], second: null, result: null });
      if (freq1 + 1 < 0) heap.push([freq1 + 1, char1]);
      push({ kind: "backtrack", phase: "restore", title: `Reinsert ${char1} if needed`, detail: freq1 + 1 < 0 ? `${char1} still has ${Math.abs(freq1 + 1)} copies, so put it back.` : `${char1} is exhausted and stays out of the heap.`, activeLines: [31, 32], first: [freq1, char1], second: null, result: null });
    }
  }
  push({ kind: "done", phase: "done", title: "Return the happy string", detail: `Join the selected characters: ${ans.join("") || "empty string"}.`, activeLines: [34], first: null, second: null, result: ans.join("") });
  return { frames };
}
