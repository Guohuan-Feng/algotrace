import type { FrameKind } from "../../shared/types";

export type RandomListInput = Array<[number, number | null]>;

export type CopyRandomListFrame = {
  kind: FrameKind;
  phase: "start" | "weave" | "random" | "detach" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  activeId: string | null;
  targetId: string | null;
  currentOriginalId: string | null;
  copyHeadId: string | null;
  copyTailId: string | null;
  links: Record<string, string | null>;
  originalNext: Record<string, string | null>;
  copyNext: Record<string, string | null>;
  originalRandom: Record<string, string | null>;
  copyRandom: Record<string, string | null>;
  createdIds: string[];
  result: RandomListInput | null;
};

export function createCopyRandomListDryRun(input: RandomListInput): { frames: CopyRandomListFrame[] } {
  const originalIds = input.map((_, index) => `o-${index}`);
  const copyIds = input.map((_, index) => `c-${index}`);
  const links: Record<string, string | null> = {};
  const originalRandom: Record<string, string | null> = {};
  const copyRandom: Record<string, string | null> = {};
  const createdIds = new Set<string>();
  const frames: CopyRandomListFrame[] = [];
  let currentOriginalId: string | null = originalIds[0] ?? null;
  let copyHeadId: string | null = null;
  let copyTailId: string | null = null;

  originalIds.forEach((id, index) => {
    links[id] = originalIds[index + 1] ?? null;
    const randomIndex = input[index]![1];
    originalRandom[id] = randomIndex === null ? null : originalIds[randomIndex] ?? null;
  });

  const push = (frame: Omit<CopyRandomListFrame, "currentOriginalId" | "copyHeadId" | "copyTailId" | "links" | "originalNext" | "copyNext" | "originalRandom" | "copyRandom" | "createdIds">) => frames.push({
    ...frame,
    currentOriginalId,
    copyHeadId,
    copyTailId,
    links: { ...links },
    originalNext: Object.fromEntries(originalIds.map((id) => [id, links[id] ?? null])),
    copyNext: Object.fromEntries([...createdIds].map((id) => [id, links[id] ?? null])),
    originalRandom: { ...originalRandom },
    copyRandom: { ...copyRandom },
    createdIds: [...createdIds],
  });

  push({ kind: "start", phase: "start", title: "Keep the original list intact", detail: "First weave one fresh copy node after every original node. The original random arrows never change.", activeLines: [5], activeId: currentOriginalId, targetId: null, result: null });

  originalIds.forEach((originalId, index) => {
    const copyId = copyIds[index]!;
    const oldNext = links[originalId] ?? null;
    createdIds.add(copyId);
    links[copyId] = oldNext;
    links[originalId] = copyId;
    currentOriginalId = originalId;
    push({ kind: "build", phase: "weave", title: `Insert copy(${valueAt(index)}) after ${valueAt(index)}`, detail: `copy.next takes the old successor, then original.next points to the new copy.`, activeLines: [7, 8, 9], activeId: originalId, targetId: copyId, result: null });
  });

  originalIds.forEach((originalId, index) => {
    const copyId = copyIds[index]!;
    const originalRandomId = originalRandom[originalId];
    copyRandom[copyId] = originalRandomId ? links[originalRandomId] ?? null : null;
    currentOriginalId = originalId;
    push({ kind: "build", phase: "random", title: `Set copy(${valueAt(index)}).random`, detail: originalRandomId ? `original.random points to ${label(originalRandomId)}, whose next node is ${label(copyRandom[copyId])}.` : "The original random pointer is None, so the copy random pointer is also None.", activeLines: originalRandomId ? [13, 14, 15] : [13, 15], activeId: copyId, targetId: copyRandom[copyId], result: null });
  });

  originalIds.forEach((originalId, index) => {
    const copyId = copyIds[index]!;
    const nextOriginalId = links[copyId] ?? null;
    links[originalId] = nextOriginalId;
    if (copyTailId) links[copyTailId] = copyId;
    else copyHeadId = copyId;
    copyTailId = copyId;
    currentOriginalId = nextOriginalId;
    push({ kind: "backtrack", phase: "detach", title: `Detach original ${valueAt(index)} and append its copy`, detail: `Restore original.next to ${label(nextOriginalId)}, then connect the copied output tail to ${label(copyId)}.`, activeLines: [21, 22, 23, 24, 25], activeId: originalId, targetId: copyId, result: null });
  });

  const result = copyIds.map((copyId, index) => [input[index]![0], randomIndexFor(copyRandom[copyId] ?? null)] as [number, number | null]);
  currentOriginalId = null;
  push({ kind: "done", phase: "done", title: "Return the detached deep copy", detail: "Both next chains are independent, and every copy random pointer targets another copy node.", activeLines: [26], activeId: null, targetId: copyHeadId, result });
  return { frames };

  function valueAt(index: number): number { return input[index]![0]; }
  function label(id: string | null): string { if (!id) return "None"; const index = Number(id.slice(2)); return `${id.startsWith("c-") ? "copy" : "original"}(${valueAt(index)})`; }
  function randomIndexFor(copyId: string | null): number | null { return copyId ? Number(copyId.slice(2)) : null; }
}
