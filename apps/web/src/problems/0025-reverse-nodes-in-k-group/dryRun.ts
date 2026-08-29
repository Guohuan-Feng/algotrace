import type { FrameKind } from "../../shared/types";

export type ReverseKGroupFrame = {
  kind: FrameKind;
  phase: "start" | "scan" | "reverse-start" | "rewire" | "connect" | "advance" | "incomplete" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  activeId: string | null;
  targetId: string | null;
  groupPrevId: string;
  kthId: string | null;
  currentId: string | null;
  previousId: string | null;
  groupNextId: string | null;
  links: Record<string, string | null>;
  reversedIds: string[];
  result: number[] | null;
};

export function createReverseKGroupDryRun(values: number[], k: number): { frames: ReverseKGroupFrame[] } {
  const links: Record<string, string | null> = { dummy: values.length ? "node-0" : null };
  values.forEach((_, index) => { links[`node-${index}`] = index + 1 < values.length ? `node-${index + 1}` : null; });
  const frames: ReverseKGroupFrame[] = [];
  const reversedIds = new Set<string>();
  let groupPrevId = "dummy";
  let kthId: string | null = null;
  let currentId: string | null = null;
  let previousId: string | null = null;
  let groupNextId: string | null = null;
  const push = (frame: Omit<ReverseKGroupFrame, "groupPrevId" | "kthId" | "currentId" | "previousId" | "groupNextId" | "links" | "reversedIds">) => frames.push({ ...frame, groupPrevId, kthId, currentId, previousId, groupNextId, links: { ...links }, reversedIds: [...reversedIds] });

  push({ kind: "start", phase: "start", title: "Anchor the list with dummy", detail: "group_prev always sits just before the next group to reverse.", activeLines: [3, 4], activeId: "dummy", targetId: links.dummy, result: null });

  while (true) {
    kthId = groupPrevId;
    push({ kind: "visit", phase: "scan", title: `Look ahead ${k} nodes`, detail: "Find the kth node before changing any next pointers.", activeLines: [7, 8], activeId: groupPrevId, targetId: links[groupPrevId] ?? null, result: null });

    let completeGroup = true;
    for (let index = 0; index < k; index += 1) {
      kthId = kthId ? links[kthId] ?? null : null;
      if (!kthId) {
        completeGroup = false;
        break;
      }
      push({ kind: "visit", phase: "scan", title: `kth reaches ${valueOf(kthId)}`, detail: `Look-ahead ${index + 1} of ${k} confirms this node belongs to a complete group.`, activeLines: [9, 10], activeId: kthId, targetId: links[kthId] ?? null, result: null });
    }

    if (!completeGroup) {
      currentId = links[groupPrevId] ?? null;
      push({ kind: "prune", phase: "incomplete", title: "Fewer than k nodes remain", detail: "Do not reverse a partial group. Return the list exactly as it is now.", activeLines: [10, 11], activeId: currentId, targetId: null, result: traverse(values, links) });
      break;
    }

    groupNextId = links[kthId!] ?? null;
    previousId = groupNextId;
    currentId = links[groupPrevId] ?? null;
    push({ kind: "build", phase: "reverse-start", title: `Reverse the group ending at ${valueOf(kthId)}`, detail: `Save group_next = ${valueOf(groupNextId)}. It will reconnect the reversed group to the untouched suffix.`, activeLines: [13, 14], activeId: currentId, targetId: groupNextId, result: null });

    while (currentId !== groupNextId) {
      const nodeId = currentId!;
      const nextId = links[nodeId] ?? null;
      links[nodeId] = previousId;
      previousId = nodeId;
      currentId = nextId;
      reversedIds.add(nodeId);
      push({ kind: "backtrack", phase: "rewire", title: `${valueOf(nodeId)}.next = ${valueOf(links[nodeId])}`, detail: `Reverse one next pointer, then move prev to ${valueOf(previousId)} and curr to ${valueOf(currentId)}.`, activeLines: [16, 17, 18, 19], activeId: nodeId, targetId: links[nodeId], result: null });
    }

    const oldHeadId = links[groupPrevId]!;
    links[groupPrevId] = kthId;
    push({ kind: "build", phase: "connect", title: `Connect prev to ${valueOf(kthId)}`, detail: "The reversed chain is now attached back to the earlier part of the list.", activeLines: [21, 22], activeId: groupPrevId, targetId: kthId, result: null });
    groupPrevId = oldHeadId;
    kthId = null;
    currentId = null;
    previousId = null;
    groupNextId = null;
    push({ kind: "visit", phase: "advance", title: `Advance group_prev to ${valueOf(groupPrevId)}`, detail: "The original group head is now its tail, ready to precede the next group.", activeLines: [23], activeId: groupPrevId, targetId: links[groupPrevId] ?? null, result: null });
  }

  push({ kind: "done", phase: "done", title: "Return dummy.next", detail: "Every complete group was reversed in place; any final partial group stayed in order.", activeLines: [25], activeId: null, targetId: null, result: traverse(values, links) });
  return { frames };

  function valueOf(id: string | null): string { return id === null ? "None" : id === "dummy" ? "dummy" : String(values[Number(id.slice(5))]); }
}

function traverse(values: number[], links: Record<string, string | null>): number[] {
  const result: number[] = [];
  const seen = new Set<string>();
  let id = links.dummy;
  while (id && !seen.has(id)) {
    seen.add(id);
    result.push(values[Number(id.slice(5))]!);
    id = links[id] ?? null;
  }
  return result;
}
