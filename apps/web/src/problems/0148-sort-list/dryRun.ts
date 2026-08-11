import type { FrameKind } from "../../shared/types";

export type SortListPhase = "sort" | "middle" | "split" | "merge";

export type SortListFrame = {
  kind: FrameKind;
  phase: SortListPhase;
  title: string;
  detail: string;
  activeLines: number[];
  list: number[];
  leftList: number[];
  rightList: number[];
  merged: number[];
  slowIndex: number | null;
  fastIndex: number | null;
  preIndex: number | null;
  cutIndex: number | null;
  compare: [number, number] | null;
  stack: string[];
  result: number[];
};

export function createSortListDryRun(values: number[]): { frames: SortListFrame[] } {
  const frames: SortListFrame[] = [];
  const stack: string[] = [];

  const pushFrame = (frame: Omit<SortListFrame, "stack"> & { stack?: string[] }) => {
    frames.push({
      ...frame,
      stack: frame.stack ?? [...stack],
    });
  };

  pushFrame({
    kind: "start",
    phase: "sort",
    title: "Call sortList(head)",
    detail: `Start merge sort on ${formatList(values)}.`,
    activeLines: [24, 25],
    list: values,
    leftList: [],
    rightList: [],
    merged: [],
    slowIndex: null,
    fastIndex: null,
    preIndex: null,
    cutIndex: null,
    compare: null,
    result: [],
    stack: [`sortList(${formatList(values)})`],
  });

  const result = sortList(values, 0);

  pushFrame({
    kind: "done",
    phase: "sort",
    title: "Return sorted head",
    detail: `The final sorted linked list is ${formatList(result)}.`,
    activeLines: [30],
    list: result,
    leftList: [],
    rightList: [],
    merged: result,
    slowIndex: null,
    fastIndex: null,
    preIndex: null,
    cutIndex: null,
    compare: null,
    result,
    stack: ["return sorted head"],
  });

  return { frames };

  function sortList(list: number[], depth: number): number[] {
    stack.push(`sortList(${formatList(list)})`);
    pushFrame({
      kind: "visit",
      phase: "sort",
      title: `Enter sortList(${formatList(list)})`,
      detail: "Check whether the list is empty or has only one node.",
      activeLines: [24, 25],
      list,
      leftList: [],
      rightList: [],
      merged: [],
      slowIndex: null,
      fastIndex: null,
      preIndex: null,
      cutIndex: null,
      compare: null,
      result: [],
    });

    if (list.length <= 1) {
      pushFrame({
        kind: "done",
        phase: "sort",
        title: "Base case",
        detail: `${formatList(list)} is already sorted, so return head.`,
        activeLines: [25, 26],
        list,
        leftList: [],
        rightList: [],
        merged: list,
        slowIndex: null,
        fastIndex: null,
        preIndex: null,
        cutIndex: null,
        compare: null,
        result: list,
      });
      stack.pop();
      return list;
    }

    const mid = middleNode(list);
    const left = list.slice(0, mid);
    const right = list.slice(mid);

    pushFrame({
      kind: "build",
      phase: "split",
      title: "Split into two lists",
      detail: `pre.next = None splits ${formatList(list)} into ${formatList(left)} and ${formatList(right)}.`,
      activeLines: [8, 9, 27],
      list,
      leftList: left,
      rightList: right,
      merged: [],
      slowIndex: mid,
      fastIndex: null,
      preIndex: mid - 1,
      cutIndex: mid - 1,
      compare: null,
      result: [],
    });

    pushFrame({
      kind: "start",
      phase: "sort",
      title: "Sort left half",
      detail: `Recursively sort head = ${formatList(left)}.`,
      activeLines: [28],
      list: left,
      leftList: left,
      rightList: [],
      merged: [],
      slowIndex: null,
      fastIndex: null,
      preIndex: null,
      cutIndex: null,
      compare: null,
      result: [],
    });
    const sortedLeft = sortList(left, depth + 1);

    pushFrame({
      kind: "start",
      phase: "sort",
      title: "Sort right half",
      detail: `Recursively sort head2 = ${formatList(right)}.`,
      activeLines: [29],
      list: right,
      leftList: sortedLeft,
      rightList: right,
      merged: [],
      slowIndex: null,
      fastIndex: null,
      preIndex: null,
      cutIndex: null,
      compare: null,
      result: [],
    });
    const sortedRight = sortList(right, depth + 1);

    pushFrame({
      kind: "start",
      phase: "merge",
      title: "Merge sorted halves",
      detail: `Merge ${formatList(sortedLeft)} and ${formatList(sortedRight)}.`,
      activeLines: [30, 11, 12],
      list,
      leftList: sortedLeft,
      rightList: sortedRight,
      merged: [],
      slowIndex: null,
      fastIndex: null,
      preIndex: null,
      cutIndex: null,
      compare: null,
      result: [],
    });
    const merged = mergeTwoLists(sortedLeft, sortedRight);

    pushFrame({
      kind: "backtrack",
      phase: "sort",
      title: `Return ${formatList(merged)}`,
      detail: `sortList(${formatList(list)}) returns the merged sorted list.`,
      activeLines: [30],
      list: merged,
      leftList: sortedLeft,
      rightList: sortedRight,
      merged,
      slowIndex: null,
      fastIndex: null,
      preIndex: null,
      cutIndex: null,
      compare: null,
      result: merged,
    });

    stack.pop();
    return merged;
  }

  function middleNode(list: number[]): number {
    stack.push(`middleNode(${formatList(list)})`);
    let slow = 0;
    let fast = 0;
    let pre: number | null = null;

    pushFrame({
      kind: "start",
      phase: "middle",
      title: "Initialize slow and fast",
      detail: "Set slow = fast = head.",
      activeLines: [2, 3],
      list,
      leftList: [],
      rightList: [],
      merged: [],
      slowIndex: slow,
      fastIndex: fast,
      preIndex: pre,
      cutIndex: null,
      compare: null,
      result: [],
    });

    while (fast < list.length && fast + 1 < list.length) {
      pushFrame({
        kind: "visit",
        phase: "middle",
        title: "Move pointers",
        detail: `fast and fast.next exist. pre becomes slow, slow moves one step, fast moves two steps.`,
        activeLines: [4, 5, 6, 7],
        list,
        leftList: [],
        rightList: [],
        merged: [],
        slowIndex: slow,
        fastIndex: fast,
        preIndex: pre,
        cutIndex: null,
        compare: null,
        result: [],
      });
      pre = slow;
      slow += 1;
      fast += 2;

      pushFrame({
        kind: "visit",
        phase: "middle",
        title: `slow at index ${slow}`,
        detail: `slow points to ${list[slow]}, fast is ${fast < list.length ? list[fast] : "past the tail"}.`,
        activeLines: [5, 6, 7],
        list,
        leftList: [],
        rightList: [],
        merged: [],
        slowIndex: slow,
        fastIndex: fast < list.length ? fast : null,
        preIndex: pre,
        cutIndex: null,
        compare: null,
        result: [],
      });
    }

    pushFrame({
      kind: "build",
      phase: "middle",
      title: "Cut before slow",
      detail: `pre.next = None. head2 starts at index ${slow}.`,
      activeLines: [8, 9],
      list,
      leftList: list.slice(0, slow),
      rightList: list.slice(slow),
      merged: [],
      slowIndex: slow,
      fastIndex: fast < list.length ? fast : null,
      preIndex: pre,
      cutIndex: pre,
      compare: null,
      result: [],
    });
    stack.pop();
    return slow;
  }

  function mergeTwoLists(list1: number[], list2: number[]): number[] {
    stack.push(`mergeTwoLists(${formatList(list1)}, ${formatList(list2)})`);
    let i = 0;
    let j = 0;
    const merged: number[] = [];

    pushFrame({
      kind: "start",
      phase: "merge",
      title: "Create dummy node",
      detail: "Use a sentinel node so cur.next can append nodes uniformly.",
      activeLines: [11, 12],
      list: [],
      leftList: list1.slice(i),
      rightList: list2.slice(j),
      merged: [],
      slowIndex: null,
      fastIndex: null,
      preIndex: null,
      cutIndex: null,
      compare: null,
      result: [],
    });

    while (i < list1.length && j < list2.length) {
      pushFrame({
        kind: "visit",
        phase: "merge",
        title: `Compare ${list1[i]} and ${list2[j]}`,
        detail: list1[i] < list2[j] ? `${list1[i]} is smaller, append from list1.` : `${list2[j]} is smaller or equal, append from list2.`,
        activeLines: [13, 14],
        list: [],
        leftList: list1.slice(i),
        rightList: list2.slice(j),
        merged,
        slowIndex: null,
        fastIndex: null,
        preIndex: null,
        cutIndex: null,
        compare: [list1[i], list2[j]],
        result: merged,
      });

      if (list1[i] < list2[j]) {
        merged.push(list1[i]);
        i += 1;
        pushFrame({
          kind: "build",
          phase: "merge",
          title: "Append list1 node",
          detail: `cur.next = list1, then list1 = list1.next.`,
          activeLines: [15, 16, 20],
          list: [],
          leftList: list1.slice(i),
          rightList: list2.slice(j),
          merged,
          slowIndex: null,
          fastIndex: null,
          preIndex: null,
          cutIndex: null,
          compare: null,
          result: merged,
        });
      } else {
        merged.push(list2[j]);
        j += 1;
        pushFrame({
          kind: "build",
          phase: "merge",
          title: "Append list2 node",
          detail: `cur.next = list2, then list2 = list2.next.`,
          activeLines: [17, 18, 19, 20],
          list: [],
          leftList: list1.slice(i),
          rightList: list2.slice(j),
          merged,
          slowIndex: null,
          fastIndex: null,
          preIndex: null,
          cutIndex: null,
          compare: null,
          result: merged,
        });
      }
    }

    const rest = i < list1.length ? list1.slice(i) : list2.slice(j);
    const result = [...merged, ...rest];
    pushFrame({
      kind: "done",
      phase: "merge",
      title: "Attach remaining nodes",
      detail: `cur.next points to the non-empty remainder ${formatList(rest)}.`,
      activeLines: [21, 22],
      list: result,
      leftList: list1.slice(i),
      rightList: list2.slice(j),
      merged: result,
      slowIndex: null,
      fastIndex: null,
      preIndex: null,
      cutIndex: null,
      compare: null,
      result,
    });

    stack.pop();
    return result;
  }
}

function formatList(values: number[]): string {
  return `[${values.join(", ")}]`;
}
