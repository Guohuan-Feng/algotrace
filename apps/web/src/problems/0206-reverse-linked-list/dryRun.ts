import type { FrameKind } from "../../shared/types";

export type ReverseLinkedListFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  original: number[];
  nextPointers: Array<number | null>;
  prevIndex: number | null;
  curIndex: number | null;
  nxtIndex: number | null;
  changedIndex: number | null;
  phase: string;
  result: number[];
};

export function createReverseLinkedListDryRun(values: number[]): { frames: ReverseLinkedListFrame[] } {
  const frames: ReverseLinkedListFrame[] = [];
  const nextPointers: Array<number | null> = values.map((_, index) => (index + 1 < values.length ? index + 1 : null));
  let prevIndex: number | null = null;
  let curIndex: number | null = values.length ? 0 : null;
  let nxtIndex: number | null = null;

  const collectResult = (headIndex: number | null) => {
    const result: number[] = [];
    const seen = new Set<number>();
    let index = headIndex;
    while (index !== null && !seen.has(index)) {
      seen.add(index);
      result.push(values[index]);
      index = nextPointers[index];
    }
    return result;
  };

  const valueLabel = (index: number | null) => (index === null ? "None" : values[index]);

  const push = (frame: Omit<ReverseLinkedListFrame, "original" | "nextPointers" | "result">) => {
    frames.push({
      ...frame,
      original: [...values],
      nextPointers: [...nextPointers],
      result: collectResult(prevIndex),
    });
  };

  push({
    kind: "start",
    title: "Initialize pointers",
    detail: "prev = None, cur = head.",
    activeLines: [3, 4],
    prevIndex,
    curIndex,
    nxtIndex,
    changedIndex: null,
    phase: "init",
  });

  while (curIndex !== null) {
    push({
      kind: "visit",
      title: `Visit node ${valueLabel(curIndex)}`,
      detail: "cur is not None, so enter the loop.",
      activeLines: [6],
      prevIndex,
      curIndex,
      nxtIndex,
      changedIndex: null,
      phase: "while cur",
    });

    nxtIndex = nextPointers[curIndex];
    push({
      kind: "visit",
      title: "Save nxt",
      detail: nxtIndex === null ? "nxt = None because cur is the tail." : `nxt points to node ${valueLabel(nxtIndex)} before we rewrite cur.next.`,
      activeLines: [7],
      prevIndex,
      curIndex,
      nxtIndex,
      changedIndex: null,
      phase: "nxt = cur.next",
    });

    nextPointers[curIndex] = prevIndex;
    push({
      kind: "build",
      title: "Reverse current pointer",
      detail: `Set ${valueLabel(curIndex)}.next to prev (${valueLabel(prevIndex)}). The arrow on this same node changes direction.`,
      activeLines: [8],
      prevIndex,
      curIndex,
      nxtIndex,
      changedIndex: curIndex,
      phase: "cur.next = prev",
    });

    prevIndex = curIndex;
    push({
      kind: "build",
      title: "Move prev to cur",
      detail: `prev now points to ${valueLabel(prevIndex)}. The processed prefix is reversed in place.`,
      activeLines: [9],
      prevIndex,
      curIndex,
      nxtIndex,
      changedIndex: null,
      phase: "prev = cur",
    });

    curIndex = nxtIndex;
    push({
      kind: curIndex === null ? "done" : "visit",
      title: "Move cur to nxt",
      detail: curIndex === null ? "cur becomes None, so the loop will stop." : `cur moves to ${valueLabel(curIndex)}.`,
      activeLines: [10],
      prevIndex,
      curIndex,
      nxtIndex,
      changedIndex: null,
      phase: "cur = nxt",
    });
  }

  frames.push({
    kind: "done",
    title: "Return prev",
    detail: prevIndex !== null ? `prev is the new head ${valueLabel(prevIndex)}.` : "The input list was empty, return None.",
    activeLines: [12],
    original: [...values],
    nextPointers: [...nextPointers],
    prevIndex,
    curIndex: null,
    nxtIndex,
    changedIndex: null,
    phase: "return prev",
    result: collectResult(prevIndex),
  });

  return { frames };
}
