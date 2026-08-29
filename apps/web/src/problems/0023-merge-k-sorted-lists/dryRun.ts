import type { FrameKind } from "../../shared/types";

type ListNode = { id: string; value: number; listIndex: number; next: ListNode | null };
type HeapItem = { node: ListNode; listIndex: number };

export type MergeKListsFrame = {
  kind: FrameKind;
  phase: "start" | "seed" | "pop" | "append" | "push" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  activeId: string | null;
  nextId: string | null;
  heap: Array<{ id: string; value: number; listIndex: number }>;
  result: number[];
  resultIds: string[];
};

export function createMergeKListsDryRun(lists: number[][]): { frames: MergeKListsFrame[] } {
  const heads = lists.map((values, listIndex) => buildList(values, listIndex));
  const heap: HeapItem[] = [];
  const result: ListNode[] = [];
  const frames: MergeKListsFrame[] = [];
  const push = (frame: Omit<MergeKListsFrame, "heap" | "result" | "resultIds">) => frames.push({
    ...frame,
    heap: heap.map((item) => ({ id: item.node.id, value: item.node.value, listIndex: item.listIndex })),
    result: result.map((node) => node.value),
    resultIds: result.map((node) => node.id),
  });

  push({ kind: "start", phase: "start", title: "Begin with an empty min-heap", detail: "The heap holds the smallest unmerged node from each source list.", activeLines: [5], activeId: null, nextId: null });

  heads.forEach((head, listIndex) => {
    if (!head) return;
    heapPush(heap, { node: head, listIndex });
    push({ kind: "build", phase: "seed", title: `Push list ${listIndex + 1} head ${head.value}`, detail: `Add (${head.value}, list ${listIndex + 1}) so it can compete to be the next output node.`, activeLines: [6, 7], activeId: head.id, nextId: null });
  });

  while (heap.length) {
    const item = heapPop(heap)!;
    push({ kind: "visit", phase: "pop", title: `Pop minimum ${item.node.value}`, detail: `(${item.node.value}, list ${item.listIndex + 1}) is the globally smallest available node.`, activeLines: [11], activeId: item.node.id, nextId: null });
    result.push(item.node);
    push({ kind: "backtrack", phase: "append", title: `Attach ${item.node.value} to merged`, detail: "Move cur forward after connecting the popped node to the output chain.", activeLines: [12, 13], activeId: item.node.id, nextId: null });
    if (item.node.next) {
      heapPush(heap, { node: item.node.next, listIndex: item.listIndex });
      push({ kind: "build", phase: "push", title: `Push ${item.node.next.value} from list ${item.listIndex + 1}`, detail: "Only the popped node's successor can now represent this sorted source list.", activeLines: [14, 15], activeId: item.node.id, nextId: item.node.next.id });
    }
  }

  push({ kind: "done", phase: "done", title: "Return the merged chain", detail: `All nodes were removed from the heap in sorted order: [${result.map((node) => node.value).join(", ")}].`, activeLines: [17], activeId: null, nextId: null });
  return { frames };
}

function buildList(values: number[], listIndex: number): ListNode | null {
  const nodes = values.map((value, index) => ({ id: `list-${listIndex}-${index}`, value, listIndex, next: null as ListNode | null }));
  nodes.forEach((node, index) => { node.next = nodes[index + 1] ?? null; });
  return nodes[0] ?? null;
}

function less(left: HeapItem, right: HeapItem): boolean {
  return left.node.value < right.node.value || (left.node.value === right.node.value && left.listIndex < right.listIndex);
}

function heapPush(heap: HeapItem[], item: HeapItem): void {
  heap.push(item);
  let index = heap.length - 1;
  while (index > 0) {
    const parent = Math.floor((index - 1) / 2);
    if (!less(heap[index]!, heap[parent]!)) break;
    [heap[index], heap[parent]] = [heap[parent]!, heap[index]!];
    index = parent;
  }
}

function heapPop(heap: HeapItem[]): HeapItem | undefined {
  if (!heap.length) return undefined;
  const smallest = heap[0]!;
  const last = heap.pop()!;
  if (heap.length) {
    heap[0] = last;
    let index = 0;
    while (true) {
      const left = index * 2 + 1;
      const right = left + 1;
      let smallestChild = index;
      if (left < heap.length && less(heap[left]!, heap[smallestChild]!)) smallestChild = left;
      if (right < heap.length && less(heap[right]!, heap[smallestChild]!)) smallestChild = right;
      if (smallestChild === index) break;
      [heap[index], heap[smallestChild]] = [heap[smallestChild]!, heap[index]!];
      index = smallestChild;
    }
  }
  return smallest;
}
