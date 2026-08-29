import type { FrameKind } from "../../shared/types";

export type LinkedListCycleFrame = {
  kind: FrameKind;
  phase: "start" | "move" | "meet" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  slowId: string | null;
  fastId: string | null;
  meetingId: string | null;
  links: Record<string, string | null>;
  visitedIds: string[];
  result: boolean | null;
};

export function createLinkedListCycleDryRun(values: number[], cycleStart: number): { frames: LinkedListCycleFrame[] } {
  const links: Record<string, string | null> = {};
  values.forEach((_, index) => { links[`node-${index}`] = index + 1 < values.length ? `node-${index + 1}` : cycleStart >= 0 ? `node-${cycleStart}` : null; });
  const frames: LinkedListCycleFrame[] = [];
  const visitedIds = new Set<string>();
  let slowId: string | null = values.length ? "node-0" : null;
  let fastId: string | null = slowId;
  let meetingId: string | null = null;
  const push = (frame: Omit<LinkedListCycleFrame, "slowId" | "fastId" | "meetingId" | "links" | "visitedIds">) => frames.push({ ...frame, slowId, fastId, meetingId, links: { ...links }, visitedIds: [...visitedIds] });

  if (slowId) visitedIds.add(slowId);
  push({ kind: "start", phase: "start", title: "Start slow and fast at head", detail: "slow moves one link per round; fast moves two. They can meet only if the list loops.", activeLines: [3], result: null });

  while (fastId && links[fastId]) {
    slowId = slowId ? links[slowId] ?? null : null;
    const firstFastStep = links[fastId]!;
    fastId = links[firstFastStep] ?? null;
    if (slowId) visitedIds.add(slowId);
    if (fastId) visitedIds.add(fastId);
    push({ kind: "visit", phase: "move", title: `Move slow to ${label(slowId)} and fast to ${label(fastId)}`, detail: "One loop iteration advances slow once and fast twice.", activeLines: [5, 6, 7], result: null });
    if (slowId && slowId === fastId) {
      meetingId = slowId;
      push({ kind: "found", phase: "meet", title: `Pointers meet at ${label(meetingId)}`, detail: "The fast pointer lapped the slow pointer inside a cycle, so return True.", activeLines: [8, 9], result: true });
      push({ kind: "done", phase: "done", title: "Return True", detail: "A shared node for slow and fast proves this linked list contains a cycle.", activeLines: [9], result: true });
      return { frames };
    }
  }

  push({ kind: "done", phase: "done", title: "Return False", detail: "fast reached None or had no next node, so there is no cycle.", activeLines: [10], result: false });
  return { frames };

  function label(id: string | null): string { return id === null ? "None" : String(values[Number(id.slice(5))]); }
}
