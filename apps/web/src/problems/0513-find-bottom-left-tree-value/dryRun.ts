import type { TreeTraceFrame } from "../../shared/components/TreeTraceVisualizer";

type TreeNode = { id: string; value: number; left: TreeNode | null; right: TreeNode | null };
export type BottomLeftFrame = TreeTraceFrame & { phase: "start" | "level" | "visit" | "save" | "done"; level: number; queue: number[]; bottomLeft: number | null };

export function createBottomLeftDryRun(values: Array<number | null>): { frames: BottomLeftFrame[] } {
  const root = buildTree(values);
  const frames: BottomLeftFrame[] = [];
  const completed = new Set<string>();
  const queue: TreeNode[] = root ? [root] : [];
  let level = 0;
  let bottomLeft: number | null = root?.value ?? null;
  const push = (frame: Omit<BottomLeftFrame, "completedIds" | "level" | "queue" | "bottomLeft">) => frames.push({ ...frame, completedIds: [...completed], level, queue: queue.map((node) => node.value), bottomLeft });

  push({ kind: "start", phase: "start", title: "Queue the root", detail: "The first node removed from each level is that level's leftmost node.", activeLines: [3, 4], activeId: root?.id ?? null, result: null });
  while (queue.length) {
    const levelSize = queue.length;
    push({ kind: "visit", phase: "level", title: `Process level ${level}`, detail: `There are ${levelSize} node(s) in this level.`, activeLines: [5, 6], activeId: queue[0]?.id ?? null, result: null });
    for (let index = 0; index < levelSize; index += 1) {
      const node = queue.shift()!;
      push({ kind: "visit", phase: "visit", title: `Dequeue ${node.value}`, detail: index === 0 ? "This is the first node of its level." : "This node is not the leftmost one for this level.", activeLines: [7, 8], activeId: node.id, result: null });
      if (index === 0) {
        bottomLeft = node.value;
        push({ kind: "found", phase: "save", title: `Save ${node.value} as the current answer`, detail: "Any later level will replace it only with its own first node.", activeLines: [9, 10], activeId: node.id, result: null });
      }
      completed.add(node.id);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
      push({ kind: "build", phase: "visit", title: `Enqueue children of ${node.value}`, detail: `Queue now holds ${queue.map((child) => child.value).join(", ") || "no nodes"}.`, activeLines: [11, 12, 13, 14], activeId: node.id, result: null });
    }
    level += 1;
  }
  push({ kind: "done", phase: "done", title: `Return ${bottomLeft}`, detail: "The saved first node from the deepest processed level is the bottom-left value.", activeLines: [15], activeId: null, result: bottomLeft });
  return { frames };
}

function buildTree(values: Array<number | null>): TreeNode | null {
  if (typeof values[0] !== "number") return null;
  const root: TreeNode = { id: "node-0", value: values[0], left: null, right: null };
  const queue = [root];
  let cursor = 1;
  while (queue.length && cursor < values.length) {
    const node = queue.shift()!;
    const left = values[cursor], leftIndex = cursor++;
    if (typeof left === "number") { node.left = { id: `node-${leftIndex}`, value: left, left: null, right: null }; queue.push(node.left); }
    if (cursor >= values.length) break;
    const right = values[cursor], rightIndex = cursor++;
    if (typeof right === "number") { node.right = { id: `node-${rightIndex}`, value: right, left: null, right: null }; queue.push(node.right); }
  }
  return root;
}
