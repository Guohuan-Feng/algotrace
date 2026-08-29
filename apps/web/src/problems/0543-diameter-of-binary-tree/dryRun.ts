import type { TreeTraceFrame } from "../../shared/components/TreeTraceVisualizer";

type TreeNode = { id: string; value: number; left: TreeNode | null; right: TreeNode | null };
export type DiameterFrame = TreeTraceFrame & { phase: "start" | "visit" | "measure" | "return" | "done"; leftHeight: number | null; rightHeight: number | null; height: number | null; diameter: number };

export function createDiameterDryRun(values: Array<number | null>): { frames: DiameterFrame[] } {
  const root = buildTree(values);
  const frames: DiameterFrame[] = [];
  const completed = new Set<string>();
  let diameter = 0;
  let leftHeight: number | null = null;
  let rightHeight: number | null = null;
  let height: number | null = null;
  const push = (frame: Omit<DiameterFrame, "completedIds" | "leftHeight" | "rightHeight" | "height" | "diameter">) => frames.push({ ...frame, completedIds: [...completed], leftHeight, rightHeight, height, diameter });

  push({ kind: "start", phase: "start", title: "Start postorder height DFS", detail: "Each node needs both child heights before it can test a path through itself.", activeLines: [3, 11], activeId: root?.id ?? null, result: null });
  heightOf(root);
  push({ kind: "done", phase: "done", title: `Return diameter ${diameter}`, detail: "The largest left-height plus right-height value is the number of edges in the longest path.", activeLines: [12], activeId: null, result: diameter });
  return { frames };

  function heightOf(node: TreeNode | null): number {
    if (!node) return 0;
    push({ kind: "visit", phase: "visit", title: `Enter node ${node.value}`, detail: "First compute the heights of both child subtrees.", activeLines: [4, 7, 8], activeId: node.id, result: null });
    const left = heightOf(node.left);
    const right = heightOf(node.right);
    leftHeight = left;
    rightHeight = right;
    diameter = Math.max(diameter, left + right);
    push({ kind: "found", phase: "measure", title: `Path through ${node.value}: ${left} + ${right} edges`, detail: `The best diameter so far is ${diameter}.`, activeLines: [9], activeId: node.id, result: null });
    height = 1 + Math.max(left, right);
    completed.add(node.id);
    push({ kind: "build", phase: "return", title: `Return height ${height} from ${node.value}`, detail: "A parent only needs the taller child path plus this node.", activeLines: [10], activeId: node.id, result: null });
    return height;
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
