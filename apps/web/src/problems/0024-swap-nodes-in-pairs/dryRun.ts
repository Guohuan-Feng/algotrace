import type { FrameKind } from "../../shared/types";

export type SwapPairsFrame = {
  kind: FrameKind;
  phase: "start" | "select" | "prev-link" | "first-link" | "second-link" | "advance" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  activeId: string | null;
  targetId: string | null;
  prevId: string;
  firstId: string | null;
  secondId: string | null;
  afterId: string | null;
  links: Record<string, string | null>;
  completedIds: string[];
  result: number[] | null;
};

export function createSwapPairsDryRun(values: number[]): { frames: SwapPairsFrame[] } {
  const links: Record<string, string | null> = { dummy: values.length ? "node-0" : null };
  values.forEach((_, index) => { links[`node-${index}`] = index + 1 < values.length ? `node-${index + 1}` : null; });
  const frames: SwapPairsFrame[] = [];
  const completedIds = new Set<string>();
  let prevId = "dummy";
  let firstId: string | null = null;
  let secondId: string | null = null;
  let afterId: string | null = null;
  const push = (frame: Omit<SwapPairsFrame, "prevId" | "firstId" | "secondId" | "afterId" | "links" | "completedIds">) => frames.push({ ...frame, prevId, firstId, secondId, afterId, links: { ...links }, completedIds: [...completedIds] });

  push({ kind: "start", phase: "start", title: "Place a dummy before head", detail: "The dummy lets every pair use the same prev.next rewrite, including the first pair.", activeLines: [3, 4], activeId: "dummy", targetId: links.dummy, result: null });

  while (links[prevId] && links[links[prevId]!]) {
    firstId = links[prevId]!;
    secondId = links[firstId]!;
    afterId = links[secondId] ?? null;
    push({ kind: "visit", phase: "select", title: `Select ${valueOf(firstId)} and ${valueOf(secondId)}`, detail: "first and second are the adjacent nodes that will swap places.", activeLines: [7, 8], activeId: firstId, targetId: secondId, result: null });

    links[prevId] = secondId;
    push({ kind: "build", phase: "prev-link", title: `prev.next = ${valueOf(secondId)}`, detail: "The predecessor starts pointing to second, the future front of this pair.", activeLines: [10], activeId: prevId, targetId: secondId, result: null });

    links[firstId] = afterId;
    push({ kind: "build", phase: "first-link", title: `${valueOf(firstId)}.next = ${valueOf(afterId)}`, detail: "first skips over second and reconnects to the remainder of the list.", activeLines: [11], activeId: firstId, targetId: afterId, result: null });

    links[secondId] = firstId;
    completedIds.add(firstId); completedIds.add(secondId);
    push({ kind: "backtrack", phase: "second-link", title: `${valueOf(secondId)}.next = ${valueOf(firstId)}`, detail: "The pair is now swapped in place: second -> first.", activeLines: [12], activeId: secondId, targetId: firstId, result: null });

    prevId = firstId;
    push({ kind: "visit", phase: "advance", title: `Advance prev to ${valueOf(prevId)}`, detail: "first is now the tail of the swapped pair, ready to precede the next pair.", activeLines: [13], activeId: prevId, targetId: links[prevId] ?? null, result: null });
  }

  push({ kind: "done", phase: "done", title: "Return dummy.next", detail: "Pairs have been rewired in place; an odd final node remains untouched.", activeLines: [15], activeId: null, targetId: null, result: traverse(values, links) });
  return { frames };

  function valueOf(id: string | null): string { return id === null ? "None" : id === "dummy" ? "dummy" : String(values[Number(id.slice(5))]); }
}

function traverse(values: number[], links: Record<string, string | null>): number[] {
  const result: number[] = [];
  const seen = new Set<string>();
  let id = links.dummy;
  while (id && !seen.has(id)) { seen.add(id); result.push(values[Number(id.slice(5))]!); id = links[id] ?? null; }
  return result;
}
