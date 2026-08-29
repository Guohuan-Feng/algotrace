import type { FrameKind } from "../../shared/types";

export type IntersectionNode = { id: string; value: number; lane: "a" | "b" | "shared"; offset: number };
export type IntersectionFrame = {
  kind: FrameKind;
  phase: "start" | "walk" | "switch" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  pointerA: string | null;
  pointerB: string | null;
  completedIds: string[];
  links: Record<string, string | null>;
  result: number | null;
};

export function createIntersectionDryRun(aPrefix: number[], bPrefix: number[], shared: number[]): { frames: IntersectionFrame[]; nodes: IntersectionNode[] } {
  const nodes = buildNodes(aPrefix, bPrefix, shared);
  const links = buildLinks(aPrefix, bPrefix, shared);
  const headA = aPrefix.length ? "a-0" : shared.length ? "s-0" : null;
  const headB = bPrefix.length ? "b-0" : shared.length ? "s-0" : null;
  const frames: IntersectionFrame[] = [];
  const completedIds = new Set<string>();
  let pointerA = headA;
  let pointerB = headB;
  const valueOf = (nodeId: string | null) => nodeId === null ? "None" : String(nodes.find((node) => node.id === nodeId)?.value);
  const snapshot = (frame: Omit<IntersectionFrame, "pointerA" | "pointerB" | "completedIds" | "links">) => frames.push({ ...frame, pointerA, pointerB, completedIds: [...completedIds], links: { ...links } });

  snapshot({ kind: "start", phase: "start", title: "Start one pointer on each head", detail: "The lists share actual node objects only in their common suffix.", activeLines: [3], result: null });
  while (pointerA !== pointerB) {
    const oldA = pointerA;
    const oldB = pointerB;
    if (oldA) completedIds.add(oldA);
    if (oldB) completedIds.add(oldB);
    const switchedA = oldA === null;
    const switchedB = oldB === null;
    pointerA = oldA ? links[oldA] ?? null : headB;
    pointerB = oldB ? links[oldB] ?? null : headA;
    snapshot({ kind: switchedA || switchedB ? "build" : "visit", phase: switchedA || switchedB ? "switch" : "walk", title: switchedA || switchedB ? "Switch to the other list head" : `Advance A to ${valueOf(pointerA)}, B to ${valueOf(pointerB)}`, detail: switchedA || switchedB ? `A and B have now each walked the same total number of nodes. ${switchedA ? "A restarts at headB." : ""}${switchedB ? " B restarts at headA." : ""}` : "Move both pointers one next link forward.", activeLines: [5, 6, 7], result: null });
  }
  const result = pointerA ? nodes.find((node) => node.id === pointerA)?.value ?? null : null;
  snapshot({ kind: "done", phase: "done", title: result === null ? "Return None" : `Meet at shared node ${result}`, detail: result === null ? "Both pointers reach None at the same time, so there is no shared suffix." : "After the head switches, the pointers align and meet at the first shared node.", activeLines: [9], result });
  return { frames, nodes };
}

function buildNodes(aPrefix: number[], bPrefix: number[], shared: number[]): IntersectionNode[] { return [...aPrefix.map((value, offset) => ({ id: `a-${offset}`, value, lane: "a" as const, offset })), ...bPrefix.map((value, offset) => ({ id: `b-${offset}`, value, lane: "b" as const, offset })), ...shared.map((value, offset) => ({ id: `s-${offset}`, value, lane: "shared" as const, offset }))]; }
function buildLinks(aPrefix: number[], bPrefix: number[], shared: number[]): Record<string, string | null> { const links: Record<string, string | null> = {}; aPrefix.forEach((_, index) => { links[`a-${index}`] = index + 1 < aPrefix.length ? `a-${index + 1}` : shared.length ? "s-0" : null; }); bPrefix.forEach((_, index) => { links[`b-${index}`] = index + 1 < bPrefix.length ? `b-${index + 1}` : shared.length ? "s-0" : null; }); shared.forEach((_, index) => { links[`s-${index}`] = index + 1 < shared.length ? `s-${index + 1}` : null; }); return links; }
