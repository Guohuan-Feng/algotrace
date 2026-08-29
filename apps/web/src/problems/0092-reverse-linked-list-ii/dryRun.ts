import type { FrameKind } from "../../shared/types";

export type ReverseLinkedListIiFrame = {
  kind: FrameKind;
  phase: "initialize" | "seek" | "extract" | "insert" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  values: number[];
  order: number[];
  left: number;
  right: number;
  prevId: number;
  currentId: number | null;
  nextId: number | null;
  result: number[] | null;
};

export function createReverseLinkedListIiDryRun(values: number[], left: number, right: number): { frames: ReverseLinkedListIiFrame[] } {
  const frames: ReverseLinkedListIiFrame[] = [];
  const order = values.map((_, index) => index);
  let prevId = -1;
  let currentId: number | null = null;
  let nextId: number | null = null;
  const snapshot = (frame: Omit<ReverseLinkedListIiFrame, "values" | "order" | "left" | "right" | "prevId" | "currentId" | "nextId">) => { frames.push({ ...frame, values: [...values], order: [...order], left, right, prevId, currentId, nextId }); };
  snapshot({ kind: "start", phase: "initialize", title: "Place a dummy before the list", detail: "The dummy lets prev sit immediately before the reversal segment even when left is 1.", activeLines: [2, 3], result: null });
  for (let position = 1; position < left; position += 1) {
    prevId = order[position - 1]!;
    snapshot({ kind: "build", phase: "seek", title: "Advance prev before position " + left, detail: "Move prev to node " + values[prevId] + ". It must remain just before the sublist being reversed.", activeLines: [5, 6], result: null });
  }
  currentId = order[left - 1] ?? null;
  snapshot({ kind: "visit", phase: "seek", title: "current begins at position " + left, detail: "current is node " + (currentId === null ? "None" : values[currentId]) + ", the first node in the reversal segment.", activeLines: [7], result: null });
  for (let count = 0; count < right - left; count += 1) {
    const currentPosition = currentId === null ? -1 : order.indexOf(currentId);
    nextId = currentPosition >= 0 ? order[currentPosition + 1] ?? null : null;
    snapshot({ kind: "visit", phase: "extract", title: "Extract next node " + (nextId === null ? "None" : values[nextId]), detail: "Save current.next, then detach it from after current so it can be inserted at the front of the reversal segment.", activeLines: [9, 10], result: null });
    if (nextId === null) break;
    order.splice(currentPosition + 1, 1);
    const prevPosition = prevId === -1 ? -1 : order.indexOf(prevId);
    order.splice(prevPosition + 1, 0, nextId);
    snapshot({ kind: "build", phase: "insert", title: "Insert " + values[nextId] + " after prev", detail: "Set next_node.next = prev.next and prev.next = next_node. The visible chain now reflects one more reversed link.", activeLines: [11, 12, 13], result: null });
  }
  nextId = null;
  snapshot({ kind: "done", phase: "done", title: "Return the relinked list", detail: "The nodes from position " + left + " through " + right + " are reversed in place; all outside links are preserved.", activeLines: [15], result: order.map((id) => values[id]!) });
  return { frames };
}
