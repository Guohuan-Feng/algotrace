import type { FrameKind } from "../../shared/types";

export type RemoveDuplicatesListFrame = {
  kind: FrameKind;
  phase: "initialize" | "inspect" | "unlink" | "advance" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  values: number[];
  liveIndices: number[];
  removedIndices: number[];
  currentIndex: number | null;
  nextIndex: number | null;
  result: number[] | null;
};

export function createRemoveDuplicatesListDryRun(values: number[]): { frames: RemoveDuplicatesListFrame[] } {
  const frames: RemoveDuplicatesListFrame[] = [];
  const live = values.map((_, index) => index);
  const removed: number[] = [];
  let currentPosition = 0;
  const snapshot = (frame: Omit<RemoveDuplicatesListFrame, "values" | "liveIndices" | "removedIndices" | "currentIndex" | "nextIndex">) => {
    const currentIndex = live[currentPosition] ?? null;
    const nextIndex = live[currentPosition + 1] ?? null;
    frames.push({ ...frame, values: [...values], liveIndices: [...live], removedIndices: [...removed], currentIndex, nextIndex });
  };
  snapshot({ kind: "start", phase: "initialize", title: "Start at the first list node", detail: "The list is sorted, so duplicate values always appear next to their first occurrence.", activeLines: [2, 3], result: null });
  while (currentPosition < live.length - 1) {
    const currentIndex = live[currentPosition]!;
    const nextIndex = live[currentPosition + 1]!;
    snapshot({ kind: "visit", phase: "inspect", title: "Compare " + values[currentIndex] + " and " + values[nextIndex], detail: "current points to index " + currentIndex + " and current.next points to index " + nextIndex + ".", activeLines: [5, 6], result: null });
    if (values[currentIndex] === values[nextIndex]) {
      live.splice(currentPosition + 1, 1);
      removed.push(nextIndex);
      snapshot({ kind: "prune", phase: "unlink", title: "Set current.next past duplicate " + values[nextIndex], detail: "Keep the first " + values[currentIndex] + " node and bypass the next duplicate node. current stays in place to check another possible duplicate.", activeLines: [7, 8], result: null });
    } else {
      currentPosition += 1;
      snapshot({ kind: "build", phase: "advance", title: "Advance current to the next distinct value", detail: "The two values differ, so no link changes. Move current forward one node.", activeLines: [10], result: null });
    }
  }
  snapshot({ kind: "done", phase: "done", title: "Return the deduplicated list", detail: "One node remains for every distinct sorted value.", activeLines: [12], result: live.map((index) => values[index]!) });
  return { frames };
}
