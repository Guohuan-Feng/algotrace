import type { FrameKind } from "../../shared/types";

export type RemoveNthFrame = {
  kind: FrameKind;
  phase: "initialize" | "advance-fast" | "advance-both" | "remove" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  values: number[];
  headIndex: number | null;
  fastIndex: number | -1 | null;
  slowIndex: number | -1 | null;
  removedIndex: number | null;
  liveIndices: number[];
  result: number[];
};

export function createRemoveNthFromEndDryRun(values: number[], n: number): { frames: RemoveNthFrame[] } {
  const frames: RemoveNthFrame[] = [];
  const nextPointers: Array<number | null> = values.map((_, index) => (index + 1 < values.length ? index + 1 : null));
  let headIndex: number | null = values.length ? 0 : null;
  let fastIndex: number | -1 | null = -1;
  let slowIndex: number | -1 | null = -1;
  let removedIndex: number | null = null;

  const nextOf = (index: number | -1 | null) => {
    if (index === -1) return headIndex;
    return index === null ? null : nextPointers[index]!;
  };

  const liveIndices = () => {
    const indices: number[] = [];
    const seen = new Set<number>();
    let index = headIndex;
    while (index !== null && !seen.has(index)) {
      seen.add(index);
      indices.push(index);
      index = nextPointers[index]!;
    }
    return indices;
  };

  const result = () => liveIndices().map((index) => values[index]!);
  const label = (index: number | -1 | null) => index === -1 ? "dummy" : index === null ? "None" : String(values[index]);
  const snapshot = (frame: Omit<RemoveNthFrame, "values" | "headIndex" | "fastIndex" | "slowIndex" | "removedIndex" | "liveIndices" | "result">) => {
    frames.push({ ...frame, values: [...values], headIndex, fastIndex, slowIndex, removedIndex, liveIndices: liveIndices(), result: result() });
  };

  snapshot({ kind: "start", phase: "initialize", title: "Attach a dummy node", detail: "Both pointers begin at dummy, which makes removing the head use the same code path.", activeLines: [2, 3] });
  for (let step = 0; step <= n; step += 1) {
    fastIndex = nextOf(fastIndex);
    snapshot({ kind: "visit", phase: "advance-fast", title: "Advance fast to create a gap", detail: "fast moves " + (step + 1) + " of " + (n + 1) + " steps and now points to " + label(fastIndex) + ".", activeLines: [5, 6] });
  }

  while (fastIndex !== null) {
    fastIndex = nextOf(fastIndex);
    slowIndex = nextOf(slowIndex);
    snapshot({ kind: "visit", phase: "advance-both", title: "Move both pointers together", detail: "fast is " + label(fastIndex) + "; slow is " + label(slowIndex) + ". Their fixed gap keeps slow immediately before the target.", activeLines: [8, 9, 10] });
  }

  removedIndex = nextOf(slowIndex);
  if (slowIndex === -1) {
    headIndex = nextOf(removedIndex);
  } else if (slowIndex !== null) {
    nextPointers[slowIndex] = nextOf(removedIndex);
  }
  snapshot({ kind: "build", phase: "remove", title: "Bypass the target node", detail: label(slowIndex) + ".next now skips " + label(removedIndex) + ". The remaining chain is linked in place.", activeLines: [12] });
  snapshot({ kind: "done", phase: "done", title: "Return the node after dummy", detail: "dummy.next is the new head, so the resulting list is [" + result().join(", ") + "].", activeLines: [13] });
  return { frames };
}
