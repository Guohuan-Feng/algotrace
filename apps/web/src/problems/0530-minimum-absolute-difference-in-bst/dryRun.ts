import type { TreeTraceFrame } from "../../shared/components/TreeTraceVisualizer";

type TreeNode = { id: string; value: number; left: TreeNode | null; right: TreeNode | null };
export type MinimumDifferenceFrame = TreeTraceFrame & { phase: "start" | "visit" | "compare" | "done"; previous: number | null; diff: number | null; minimum: number | null };

export function createMinimumDifferenceDryRun(values: Array<number | null>): { frames: MinimumDifferenceFrame[] } {
  const root = buildTree(values);
  const frames: MinimumDifferenceFrame[] = [];
  const completed = new Set<string>();
  let previous: number | null = null;
  let minimum = Infinity;
  let diff: number | null = null;
  const push = (frame: Omit<MinimumDifferenceFrame, "completedIds" | "previous" | "diff" | "minimum">) => frames.push({ ...frame, completedIds: [...completed], previous, diff, minimum: Number.isFinite(minimum) ? minimum : null });

  push({ kind: "start", phase: "start", title: "Start inorder traversal", detail: "In a BST, sorted inorder neighbors are the only pairs that can produce the minimum difference.", activeLines: [3, 12], activeId: root?.id ?? null, result: null });
  inorder(root);
  push({ kind: "done", phase: "done", title: `Return ${minimum}`, detail: "All adjacent sorted values have been compared.", activeLines: [13], activeId: null, result: minimum });
  return { frames };

  function inorder(node: TreeNode | null): void {
    if (!node) return;
    inorder(node.left);
    push({ kind: "visit", phase: "visit", title: `Visit ${node.value} in sorted order`, detail: `The previous sorted value is ${previous ?? "none"}.`, activeLines: [7, 8], activeId: node.id, result: null });
    if (previous !== null) {
      diff = node.value - previous;
      minimum = Math.min(minimum, diff);
      push({ kind: "found", phase: "compare", title: `Compare ${node.value} - ${previous} = ${diff}`, detail: `Minimum difference is now ${minimum}.`, activeLines: [8, 9], activeId: node.id, result: null });
    }
    completed.add(node.id);
    previous = node.value;
    push({ kind: "visit", phase: "visit", title: `Store previous = ${node.value}`, detail: "Move on to the right subtree in sorted order.", activeLines: [10, 11], activeId: node.id, result: null });
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
