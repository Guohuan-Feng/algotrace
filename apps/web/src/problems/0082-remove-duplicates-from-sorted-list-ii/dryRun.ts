import type { FrameKind } from "../../shared/types";

export type RemoveDuplicatesListIiFrame = {
  kind: FrameKind;
  phase: "initialize" | "inspect" | "skip-run" | "keep" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  values: number[];
  liveIndices: number[];
  removedIndices: number[];
  prevIndex: number;
  currentIndex: number | null;
  runIndices: number[];
  result: number[] | null;
};

export function createRemoveDuplicatesListIiDryRun(values: number[]): { frames: RemoveDuplicatesListIiFrame[] } {
  const frames: RemoveDuplicatesListIiFrame[] = [];
  const live = new Set(values.map((_, index) => index));
  const removed = new Set<number>();
  let prevIndex = -1;
  let currentIndex = 0;
  const snapshot = (frame: Omit<RemoveDuplicatesListIiFrame, "values" | "liveIndices" | "removedIndices" | "prevIndex" | "currentIndex">) => {
    frames.push({ ...frame, values: [...values], liveIndices: [...live], removedIndices: [...removed], prevIndex, currentIndex: currentIndex < values.length ? currentIndex : null });
  };

  snapshot({ kind: "start", phase: "initialize", title: "Add a dummy node before the head", detail: "prev begins at dummy so it can also unlink a duplicate run at the start of the original list.", activeLines: [2, 3], runIndices: [], result: null });
  while (currentIndex < values.length) {
    snapshot({ kind: "visit", phase: "inspect", title: "Inspect node " + values[currentIndex] + " at index " + currentIndex, detail: "Compare this node with its next node to decide whether it begins a duplicate run.", activeLines: [5, 6], runIndices: [], result: null });
    if (currentIndex + 1 < values.length && values[currentIndex] === values[currentIndex + 1]) {
      const value = values[currentIndex]!;
      const runStart = currentIndex;
      while (currentIndex + 1 < values.length && values[currentIndex] === values[currentIndex + 1]) currentIndex += 1;
      const runEnd = currentIndex;
      const runIndices = Array.from({ length: runEnd - runStart + 1 }, (_, offset) => runStart + offset);
      snapshot({ kind: "visit", phase: "skip-run", title: "Find the full duplicate run of " + value, detail: "All indices " + runStart + " through " + runEnd + " have value " + value + ". None of them may remain in the answer.", activeLines: [7, 8], runIndices, result: null });
      runIndices.forEach((index) => { live.delete(index); removed.add(index); });
      currentIndex += 1;
      snapshot({ kind: "prune", phase: "skip-run", title: "Set prev.next past every " + value, detail: "prev stays at " + pointerLabel(values, prevIndex) + " and its next link skips the entire duplicate run to " + pointerLabel(values, currentIndex) + ".", activeLines: [9, 10], runIndices, result: null });
    } else {
      prevIndex = currentIndex;
      currentIndex += 1;
      snapshot({ kind: "build", phase: "keep", title: "Keep unique node " + values[prevIndex], detail: "No equal neighbor follows it, so move prev forward to this retained node.", activeLines: [12, 13], runIndices: [], result: null });
    }
  }
  const result = [...live].map((index) => values[index]!);
  snapshot({ kind: "done", phase: "done", title: "Return the relinked list", detail: "Every duplicate run is skipped, leaving only values that occurred exactly once.", activeLines: [15], runIndices: [], result });
  return { frames };
}

function pointerLabel(values: number[], index: number): string {
  if (index === -1) return "dummy";
  return index >= values.length ? "None" : "node " + values[index];
}
