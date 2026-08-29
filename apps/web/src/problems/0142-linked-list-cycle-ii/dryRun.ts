import type { FrameKind } from "../../shared/types";

export type LinkedListCycleIIFrame = {
  kind: FrameKind;
  phase: "start" | "chase" | "meet" | "seek" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  slowId: string | null;
  fastId: string | null;
  seekerId: string | null;
  meetingId: string | null;
  entryId: string | null;
  links: Record<string, string | null>;
  visitedIds: string[];
  result: number | null;
};

export function createLinkedListCycleIIdryRun(values: number[], cycleStart: number): { frames: LinkedListCycleIIFrame[] } {
  const links: Record<string, string | null> = {};
  values.forEach((_, index) => { links[`node-${index}`] = index + 1 < values.length ? `node-${index + 1}` : cycleStart >= 0 ? `node-${cycleStart}` : null; });
  const frames: LinkedListCycleIIFrame[] = [];
  const visitedIds = new Set<string>();
  let slowId: string | null = values.length ? "node-0" : null;
  let fastId: string | null = slowId;
  let seekerId: string | null = null;
  let meetingId: string | null = null;
  let entryId: string | null = null;
  const push = (frame: Omit<LinkedListCycleIIFrame, "slowId" | "fastId" | "seekerId" | "meetingId" | "entryId" | "links" | "visitedIds">) => frames.push({ ...frame, slowId, fastId, seekerId, meetingId, entryId, links: { ...links }, visitedIds: [...visitedIds] });

  if (slowId) visitedIds.add(slowId);
  push({ kind: "start", phase: "start", title: "Start fast and slow at head", detail: "First prove a cycle exists by looking for a fast/slow meeting point.", activeLines: [3], result: null });

  while (fastId && links[fastId]) {
    slowId = slowId ? links[slowId] ?? null : null;
    const firstFastStep = links[fastId]!;
    fastId = links[firstFastStep] ?? null;
    if (slowId) visitedIds.add(slowId);
    if (fastId) visitedIds.add(fastId);
    push({ kind: "visit", phase: "chase", title: `Chase: slow = ${label(slowId)}, fast = ${label(fastId)}`, detail: "slow advances one link while fast advances two links.", activeLines: [5, 6, 7], result: null });
    if (slowId && slowId === fastId) {
      meetingId = slowId;
      push({ kind: "found", phase: "meet", title: `Meet at ${label(meetingId)}`, detail: "A meeting proves there is a cycle, but this node is not necessarily the cycle entry.", activeLines: [8, 9], result: null });
      break;
    }
  }

  if (!meetingId) {
    push({ kind: "done", phase: "done", title: "Return None", detail: "fast reached the end, so the linked list has no cycle entry.", activeLines: [10, 11], result: null });
    return { frames };
  }

  seekerId = values.length ? "node-0" : null;
  push({ kind: "build", phase: "seek", title: "Reset one pointer to head", detail: "Keep slow at the meeting point; now move seeker and slow one step at a time.", activeLines: [13], result: null });
  while (seekerId !== slowId) {
    seekerId = seekerId ? links[seekerId] ?? null : null;
    slowId = slowId ? links[slowId] ?? null : null;
    if (seekerId) visitedIds.add(seekerId);
    if (slowId) visitedIds.add(slowId);
    push({ kind: "visit", phase: "seek", title: `Seek: head pointer = ${label(seekerId)}, slow = ${label(slowId)}`, detail: "From the meeting point, equal-speed pointers first meet at the cycle entry.", activeLines: [14, 15, 16], result: null });
  }

  entryId = seekerId;
  push({ kind: "done", phase: "done", title: `Return cycle entry ${label(entryId)}`, detail: "The reset pointer and slow meet exactly where the cycle begins.", activeLines: [17], result: entryId === null ? null : Number(entryId.slice(5)) });
  return { frames };

  function label(id: string | null): string { return id === null ? "None" : String(values[Number(id.slice(5))]); }
}
