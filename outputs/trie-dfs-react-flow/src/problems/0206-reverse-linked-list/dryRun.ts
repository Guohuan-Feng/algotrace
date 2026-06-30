import type { FrameKind } from "../../types";

export type ReverseLinkedListFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  original: number[];
  reversed: number[];
  remaining: number[];
  curIndex: number | null;
  nextIndex: number | null;
  phase: string;
  result: number[];
};

export function createReverseLinkedListDryRun(values: number[]): { frames: ReverseLinkedListFrame[] } {
  const frames: ReverseLinkedListFrame[] = [];
  let reversed: number[] = [];
  let index = 0;

  const push = (frame: Omit<ReverseLinkedListFrame, "original" | "reversed" | "remaining" | "result">) => {
    frames.push({
      ...frame,
      original: [...values],
      reversed: [...reversed],
      remaining: values.slice(index),
      result: [...reversed],
    });
  };

  push({
    kind: "start",
    title: "Initialize pointers",
    detail: "prev = None, cur = head.",
    activeLines: [3, 4],
    curIndex: values.length ? 0 : null,
    nextIndex: null,
    phase: "init",
  });

  while (index < values.length) {
    const curIndex = index;
    const nextIndex = index + 1 < values.length ? index + 1 : null;

    push({
      kind: "visit",
      title: `Visit node ${values[curIndex]}`,
      detail: "cur is not None, so enter the loop.",
      activeLines: [6],
      curIndex,
      nextIndex,
      phase: "while cur",
    });

    push({
      kind: "visit",
      title: "Save nxt",
      detail: nextIndex === null ? "nxt = None because cur is the tail." : `nxt points to node ${values[nextIndex]}.`,
      activeLines: [7],
      curIndex,
      nextIndex,
      phase: "nxt = cur.next",
    });

    push({
      kind: "build",
      title: "Reverse current pointer",
      detail: `Set ${values[curIndex]}.next to prev${reversed.length ? `, whose head is ${reversed[0]}` : " (None)"}.`,
      activeLines: [8],
      curIndex,
      nextIndex,
      phase: "cur.next = prev",
    });

    reversed = [values[curIndex], ...reversed];
    push({
      kind: "build",
      title: "Move prev to cur",
      detail: `prev now points to ${values[curIndex]}. The reversed list grows by one node.`,
      activeLines: [9],
      curIndex,
      nextIndex,
      phase: "prev = cur",
    });

    index += 1;
    push({
      kind: nextIndex === null ? "done" : "visit",
      title: "Move cur to nxt",
      detail: nextIndex === null ? "cur becomes None, so the loop will stop." : `cur moves to ${values[nextIndex]}.`,
      activeLines: [10],
      curIndex: nextIndex,
      nextIndex: index + 1 < values.length ? index + 1 : null,
      phase: "cur = nxt",
    });
  }

  frames.push({
    kind: "done",
    title: "Return prev",
    detail: reversed.length ? `prev is the new head ${reversed[0]}.` : "The input list was empty, return None.",
    activeLines: [12],
    original: [...values],
    reversed: [...reversed],
    remaining: [],
    curIndex: null,
    nextIndex: null,
    phase: "return prev",
    result: [...reversed],
  });

  return { frames };
}
