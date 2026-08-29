import type { FrameKind } from "../../shared/types";

export type ReorderListFrame = {
  kind: FrameKind;
  phase: "start" | "middle" | "reverse" | "merge" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  slowId: string | null;
  fastId: string | null;
  previousId: string | null;
  currentId: string | null;
  firstId: string | null;
  secondId: string | null;
  links: Record<string, string | null>;
  result: number[] | null;
};

export function createReorderListDryRun(values: number[]): { frames: ReorderListFrame[] } {
  const links: Record<string, string | null> = {};
  values.forEach((_, index) => { links[id(index)] = index + 1 < values.length ? id(index + 1) : null; });
  const frames: ReorderListFrame[] = [];
  let slowId: string | null = values.length ? id(0) : null;
  let fastId: string | null = slowId;
  let previousId: string | null = null;
  let currentId: string | null = null;
  let firstId: string | null = null;
  let secondId: string | null = null;
  const push = (frame: Omit<ReorderListFrame, "slowId" | "fastId" | "previousId" | "currentId" | "firstId" | "secondId" | "links">) => frames.push({ ...frame, slowId, fastId, previousId, currentId, firstId, secondId, links: { ...links } });

  push({ kind: "start", phase: "start", title: "Start slow and fast at head", detail: "Slow moves one node per loop. Fast moves two, so slow stops at the second half.", activeLines: [3], result: null });
  while (fastId && links[fastId]) {
    slowId = slowId ? links[slowId] ?? null : null;
    const oneStep = links[fastId];
    fastId = oneStep ? links[oneStep] ?? null : null;
    push({ kind: "visit", phase: "middle", title: `Find middle: slow = ${valueOf(slowId)}, fast = ${valueOf(fastId)}`, detail: "The two-speed chase splits the list without allocating another list.", activeLines: [5, 6, 7], result: null });
  }

  currentId = slowId;
  previousId = null;
  push({ kind: "build", phase: "reverse", title: `Reverse from ${valueOf(currentId)}`, detail: "Reverse the second half in place. prev grows into the reversed chain.", activeLines: [9, 10], result: null });
  while (currentId) {
    const nodeId = currentId;
    const nextId = links[nodeId] ?? null;
    links[nodeId] = previousId;
    previousId = nodeId;
    currentId = nextId;
    push({ kind: "backtrack", phase: "reverse", title: `${valueOf(nodeId)}.next now points backward`, detail: `Save next, point ${valueOf(nodeId)} to ${valueOf(links[nodeId])}, then advance curr.`, activeLines: [12, 13, 14, 15], result: null });
  }

  firstId = values.length ? id(0) : null;
  secondId = previousId;
  push({ kind: "build", phase: "merge", title: "Interleave both halves", detail: "first starts at head; second starts at the head of the reversed suffix.", activeLines: [17, 18], result: null });
  while (secondId && links[secondId]) {
    const nextFirst = firstId ? links[firstId] ?? null : null;
    const nextSecond = links[secondId] ?? null;
    if (!firstId || !nextFirst || !nextSecond) break;
    links[firstId] = secondId;
    links[secondId] = nextFirst;
    push({ kind: "build", phase: "merge", title: `Insert ${valueOf(secondId)} after ${valueOf(firstId)}`, detail: "Reconnect one node from the reversed half between two nodes from the first half.", activeLines: [21, 22, 23, 24], result: null });
    firstId = nextFirst;
    secondId = nextSecond;
    push({ kind: "visit", phase: "merge", title: "Advance both merge pointers", detail: `first = ${valueOf(firstId)}, second = ${valueOf(secondId)}.`, activeLines: [25, 26], result: null });
  }

  push({ kind: "done", phase: "done", title: "Reordering complete", detail: "The final list alternates nodes from its front and reversed back halves.", activeLines: [28], result: traverse(values, links) });
  return { frames };

  function valueOf(nodeId: string | null): string { return nodeId === null ? "None" : String(values[Number(nodeId.slice(5))]); }
}

function id(index: number): string { return `node-${index}`; }

function traverse(values: number[], links: Record<string, string | null>): number[] {
  const result: number[] = [];
  const seen = new Set<string>();
  let currentId: string | null = values.length ? id(0) : null;
  while (currentId && !seen.has(currentId)) {
    seen.add(currentId);
    result.push(values[Number(currentId.slice(5))]!);
    currentId = links[currentId] ?? null;
  }
  return result;
}
