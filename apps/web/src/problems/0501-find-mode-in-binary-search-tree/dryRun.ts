import type { TreeTraceFrame } from "../../shared/components/TreeTraceVisualizer";

type TreeNode = { id: string; value: number; left: TreeNode | null; right: TreeNode | null };

export type FindModeFrame = TreeTraceFrame & {
  phase: "start" | "visit" | "count" | "mode" | "done";
  value: number | null;
  previous: number | null;
  count: number;
  maxCount: number;
  modes: number[];
};

export function createFindModeDryRun(values: Array<number | null>): { frames: FindModeFrame[] } {
  const root = buildTree(values);
  const frames: FindModeFrame[] = [];
  const completed = new Set<string>();
  let previous: number | null = null;
  let count = 0;
  let maxCount = 0;
  let modes: number[] = [];
  const push = (frame: Omit<FindModeFrame, "completedIds" | "value" | "previous" | "count" | "maxCount" | "modes"> & { value?: number | null }) => {
    frames.push({ ...frame, value: frame.value ?? null, previous, count, maxCount, modes: [...modes], completedIds: [...completed] });
  };

  push({ kind: "start", phase: "start", title: "Start inorder traversal", detail: "BST inorder traversal puts equal values next to one another, making every frequency run visible.", activeLines: [3, 15], activeId: root?.id ?? null, result: null });
  inorder(root);
  push({ kind: "done", phase: "done", title: "Return every mode", detail: `The maximum observed frequency is ${maxCount}.`, activeLines: [16], activeId: null, result: [...modes] });
  return { frames };

  function inorder(node: TreeNode | null): void {
    if (!node) return;
    inorder(node.left);
    push({ kind: "visit", phase: "visit", title: `Read inorder value ${node.value}`, detail: `Compare ${node.value} with the previous inorder value ${previous ?? "none"}.`, activeLines: [7, 8], activeId: node.id, result: null, value: node.value });
    count = node.value === previous ? count + 1 : 1;
    completed.add(node.id);
    push({ kind: "build", phase: "count", title: `Run count for ${node.value}: ${count}`, detail: node.value === previous ? "The value matches the previous node, so extend this run." : "A new value starts a fresh frequency run.", activeLines: [8], activeId: node.id, result: null, value: node.value });
    if (count > maxCount) {
      maxCount = count;
      modes = [node.value];
      push({ kind: "found", phase: "mode", title: `${node.value} becomes the new mode`, detail: `Its frequency ${count} exceeds the old maximum.`, activeLines: [9, 10], activeId: node.id, result: null, value: node.value });
    } else if (count === maxCount) {
      modes.push(node.value);
      push({ kind: "found", phase: "mode", title: `${node.value} ties for the mode`, detail: `Its frequency matches the current maximum ${maxCount}.`, activeLines: [11, 12], activeId: node.id, result: null, value: node.value });
    }
    previous = node.value;
    push({ kind: "visit", phase: "visit", title: `Store previous = ${node.value}`, detail: "The next inorder value will compare against this one.", activeLines: [13, 14], activeId: node.id, result: null, value: node.value });
    inorder(node.right);
  }
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
