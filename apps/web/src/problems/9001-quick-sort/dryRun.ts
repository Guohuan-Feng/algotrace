import type { FrameKind } from "../../shared/types";

export type QuickSortFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  nums: number[];
  left: number;
  right: number;
  i: number | null;
  j: number | null;
  pivotIndex: number | null;
  sorted: number[];
  stack: string[];
};

export function createQuickSortDryRun(input: number[]): { frames: QuickSortFrame[] } {
  const nums = [...input];
  const frames: QuickSortFrame[] = [];
  const sorted = new Set<number>();
  const stack: string[] = [];

  const push = (frame: Omit<QuickSortFrame, "nums" | "sorted" | "stack"> & { stack?: string[] }) => {
    frames.push({ ...frame, nums: [...nums], sorted: [...sorted], stack: frame.stack ?? [...stack] });
  };

  push({
    kind: "start",
    title: "Start quick_sort",
    detail: `Sort the whole array from 0 to ${nums.length - 1}.`,
    activeLines: [17],
    left: 0,
    right: nums.length - 1,
    i: null,
    j: null,
    pivotIndex: null,
    stack: [`quick_sort(0, ${nums.length - 1})`],
  });

  quickSort(0, nums.length - 1);

  push({
    kind: "done",
    title: "Sorted",
    detail: `All recursive ranges are done.`,
    activeLines: [19],
    left: 0,
    right: nums.length - 1,
    i: null,
    j: null,
    pivotIndex: null,
    stack: ["return"],
  });

  return { frames };

  function quickSort(left: number, right: number) {
    stack.push(`quick_sort(${left}, ${right})`);
    push({
      kind: "visit",
      title: `Enter quick_sort(${left}, ${right})`,
      detail: "Check the base case left >= right.",
      activeLines: [17, 18],
      left,
      right,
      i: null,
      j: null,
      pivotIndex: null,
    });

    if (left >= right) {
      if (left === right) sorted.add(left);
      push({
        kind: "done",
        title: "Base case",
        detail: left === right ? `Single element ${nums[left]} is already sorted.` : "Empty range returns immediately.",
        activeLines: [18, 19],
        left,
        right,
        i: null,
        j: null,
        pivotIndex: left === right ? left : null,
      });
      stack.pop();
      return;
    }

    const pivot = partition(left, right);
    sorted.add(pivot);
    push({
      kind: "found",
      title: `Pivot fixed at ${pivot}`,
      detail: `${nums[pivot]} is now in its final position.`,
      activeLines: [21],
      left,
      right,
      i: pivot,
      j: pivot,
      pivotIndex: pivot,
    });

    push({
      kind: "start",
      title: "Sort left side",
      detail: `quick_sort(${left}, ${pivot - 1})`,
      activeLines: [23],
      left,
      right: pivot - 1,
      i: null,
      j: null,
      pivotIndex: pivot,
    });
    quickSort(left, pivot - 1);

    push({
      kind: "start",
      title: "Sort right side",
      detail: `quick_sort(${pivot + 1}, ${right})`,
      activeLines: [24],
      left: pivot + 1,
      right,
      i: null,
      j: null,
      pivotIndex: pivot,
    });
    quickSort(pivot + 1, right);
    stack.pop();
  }

  function partition(left: number, right: number) {
    stack.push(`partition(${left}, ${right})`);
    let i = left;
    let j = right;
    const pivotValue = nums[left];

    push({
      kind: "start",
      title: `Partition [${left}, ${right}]`,
      detail: `Use nums[left] = ${pivotValue} as pivot.`,
      activeLines: [1, 2],
      left,
      right,
      i,
      j,
      pivotIndex: left,
    });

    while (i < j) {
      push({
        kind: "visit",
        title: "Move j left",
        detail: `Find a value smaller than pivot ${pivotValue}.`,
        activeLines: [4, 5, 6],
        left,
        right,
        i,
        j,
        pivotIndex: left,
      });
      while (i < j && nums[j] >= pivotValue) {
        j -= 1;
        push({
          kind: "visit",
          title: `j -> ${j}`,
          detail: `nums[j] is still >= pivot, keep moving.`,
          activeLines: [5, 6],
          left,
          right,
          i,
          j,
          pivotIndex: left,
        });
      }

      push({
        kind: "visit",
        title: "Move i right",
        detail: `Find a value greater than pivot ${pivotValue}.`,
        activeLines: [8, 9],
        left,
        right,
        i,
        j,
        pivotIndex: left,
      });
      while (i < j && nums[i] <= pivotValue) {
        i += 1;
        push({
          kind: "visit",
          title: `i -> ${i}`,
          detail: `nums[i] is still <= pivot, keep moving.`,
          activeLines: [8, 9],
          left,
          right,
          i,
          j,
          pivotIndex: left,
        });
      }

      if (i < j) {
        [nums[i], nums[j]] = [nums[j], nums[i]];
        push({
          kind: "build",
          title: `Swap i and j`,
          detail: `Swap nums[${i}] and nums[${j}].`,
          activeLines: [11],
          left,
          right,
          i,
          j,
          pivotIndex: left,
        });
      }
    }

    [nums[i], nums[left]] = [nums[left], nums[i]];
    push({
      kind: "found",
      title: "Move pivot into place",
      detail: `Swap nums[${i}] with nums[${left}], then return ${i}.`,
      activeLines: [13, 15],
      left,
      right,
      i,
      j,
      pivotIndex: i,
    });
    stack.pop();
    return i;
  }
}
