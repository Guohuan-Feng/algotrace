import type { FrameKind } from "../../shared/types";

export type RemoveLinkedListElementsFrame = {
  kind: FrameKind;
  phase: "initialize" | "inspect" | "unlink" | "advance" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  values: number[];
  liveIndices: number[];
  removedIndices: number[];
  prevIndex: number | -1 | null;
  currentIndex: number | null;
  lastRemoved: number | null;
  result: number[] | null;
};

export function createRemoveLinkedListElementsDryRun(values: number[], val: number): { frames: RemoveLinkedListElementsFrame[] } {
  const frames: RemoveLinkedListElementsFrame[] = [];
  const next = values.map((_, index) => (index + 1 < values.length ? index + 1 : null));
  let head = values.length ? 0 : null;
  let prev: number | -1 | null = -1;
  let current = head;
  const removed: number[] = [];
  let lastRemoved: number | null = null;

  const liveIndices = () => {
    const indices: number[] = [];
    const traversed = new Set<number>();
    let index = head;
    while (index !== null && !traversed.has(index)) { traversed.add(index); indices.push(index); index = next[index]!; }
    return indices;
  };
  const result = () => liveIndices().map((index) => values[index]!);
  const snapshot = (frame: Omit<RemoveLinkedListElementsFrame, "values" | "liveIndices" | "removedIndices" | "prevIndex" | "currentIndex" | "lastRemoved">) => frames.push({ ...frame, values: [...values], liveIndices: liveIndices(), removedIndices: [...removed], prevIndex: prev, currentIndex: current, lastRemoved });

  snapshot({ kind: "start", phase: "initialize", title: "Attach a dummy before head", detail: "A dummy node lets the algorithm remove the first real node with the same prev.next assignment.", activeLines: [2, 3], result: null });
  while (current !== null) {
    snapshot({ kind: "visit", phase: "inspect", title: `Inspect node ${values[current]}`, detail: `Compare current.val = ${values[current]} with val = ${val}.`, activeLines: [5, 6], result: null });
    if (values[current] === val) {
      const removedIndex = current;
      const successor = next[current]!;
      if (prev === -1) head = successor;
      else if (prev !== null) next[prev] = successor;
      current = successor;
      removed.push(removedIndex);
      lastRemoved = removedIndex;
      snapshot({ kind: "prune", phase: "unlink", title: `Bypass node ${values[removedIndex]}`, detail: `${prev === -1 ? "dummy" : `node ${values[prev!]}`}.next now skips the matching node. prev stays in place while current moves to its successor.`, activeLines: [7, 8], result: null });
    } else {
      prev = current;
      current = next[current]!;
      lastRemoved = null;
      snapshot({ kind: "build", phase: "advance", title: "Keep node and advance both pointers", detail: "The value does not match, so prev becomes current and current advances one node.", activeLines: [10, 11], result: null });
    }
  }
  snapshot({ kind: "done", phase: "done", title: "Return dummy.next", detail: `All matching nodes are bypassed. The remaining list is [${result().join(", ")}].`, activeLines: [13], result: result() });
  return { frames };
}
