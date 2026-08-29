import type { FrameKind } from "../../shared/types";

type TreeNode = { id: string; value: number; left: TreeNode | null; right: TreeNode | null };

export type InvertBinaryTreeFrame = {
  kind: FrameKind;
  phase: "start" | "enter" | "swap" | "left" | "right" | "empty" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  activeId: string | null;
  leftLinks: Record<string, string | null>;
  rightLinks: Record<string, string | null>;
  invertedIds: string[];
  stack: string[];
  result: Array<number | null> | null;
};

export function createInvertBinaryTreeDryRun(values: Array<number | null>): { frames: InvertBinaryTreeFrame[] } {
  const root = buildTree(values);
  const frames: InvertBinaryTreeFrame[] = [];
  const leftLinks: Record<string, string | null> = {};
  const rightLinks: Record<string, string | null> = {};
  const invertedIds = new Set<string>();
  const stack: string[] = [];

  forEachNode(root, (node) => {
    leftLinks[node.id] = node.left?.id ?? null;
    rightLinks[node.id] = node.right?.id ?? null;
  });

  const push = (frame: Omit<InvertBinaryTreeFrame, "leftLinks" | "rightLinks" | "invertedIds" | "stack">) => {
    frames.push({ ...frame, leftLinks: { ...leftLinks }, rightLinks: { ...rightLinks }, invertedIds: [...invertedIds], stack: [...stack] });
  };

  push({ kind: "start", phase: "start", title: "Invert from the root", detail: "At every node, swap the child pointers before recursively inverting both new subtrees.", activeLines: [2], activeId: root?.id ?? null, result: null });
  invert(root);
  push({ kind: "done", phase: "done", title: "Return the inverted tree", detail: "Every node now has its original left and right subtree exchanged.", activeLines: [10], activeId: null, result: toLevelOrder(root, leftLinks, rightLinks) });
  return { frames };

  function invert(node: TreeNode | null): void {
    if (!node) {
      push({ kind: "prune", phase: "empty", title: "Empty child: return None", detail: "There is no subtree to invert at this branch.", activeLines: [3, 4], activeId: null, result: null });
      return;
    }
    stack.push(`invertTree(${node.value})`);
    push({ kind: "visit", phase: "enter", title: `Enter node ${node.value}`, detail: "Prepare to exchange its two child pointers.", activeLines: [2], activeId: node.id, result: null });
    const left = leftLinks[node.id] ?? null;
    leftLinks[node.id] = rightLinks[node.id] ?? null;
    rightLinks[node.id] = left;
    invertedIds.add(node.id);
    push({ kind: "backtrack", phase: "swap", title: `Swap ${node.value}'s children`, detail: `left becomes ${nodeValue(leftLinks[node.id])}; right becomes ${nodeValue(rightLinks[node.id])}.`, activeLines: [6], activeId: node.id, result: null });
    const newLeft = childById(leftLinks[node.id]);
    push({ kind: "visit", phase: "left", title: `Invert the new left subtree of ${node.value}`, detail: newLeft ? `Recurse into ${newLeft.value}, which used to be on the right.` : "The new left child is None.", activeLines: [7], activeId: newLeft?.id ?? node.id, result: null });
    invert(newLeft);
    const newRight = childById(rightLinks[node.id]);
    push({ kind: "visit", phase: "right", title: `Invert the new right subtree of ${node.value}`, detail: newRight ? `Recurse into ${newRight.value}, which used to be on the left.` : "The new right child is None.", activeLines: [8], activeId: newRight?.id ?? node.id, result: null });
    invert(newRight);
    stack.pop();
  }

  function childById(id: string | null | undefined): TreeNode | null {
    if (!id) return null;
    let found: TreeNode | null = null;
    forEachNode(root, (node) => { if (node.id === id) found = node; });
    return found;
  }

  function nodeValue(id: string | null | undefined): string {
    const node = childById(id);
    return node ? String(node.value) : "None";
  }
}

function buildTree(values: Array<number | null>): TreeNode | null {
  if (typeof values[0] !== "number") return null;
  const root: TreeNode = { id: "node-0", value: values[0], left: null, right: null };
  const queue = [root];
  let index = 1;
  while (queue.length && index < values.length) {
    const node = queue.shift()!;
    const left = values[index]; const leftIndex = index++;
    if (typeof left === "number") { node.left = { id: `node-${leftIndex}`, value: left, left: null, right: null }; queue.push(node.left); }
    if (index >= values.length) break;
    const right = values[index]; const rightIndex = index++;
    if (typeof right === "number") { node.right = { id: `node-${rightIndex}`, value: right, left: null, right: null }; queue.push(node.right); }
  }
  return root;
}

function forEachNode(root: TreeNode | null, visit: (node: TreeNode) => void): void {
  if (!root) return;
  visit(root); forEachNode(root.left, visit); forEachNode(root.right, visit);
}

function toLevelOrder(root: TreeNode | null, leftLinks: Record<string, string | null>, rightLinks: Record<string, string | null>): Array<number | null> {
  if (!root) return [];
  const nodes = new Map<string, TreeNode>(); forEachNode(root, (node) => nodes.set(node.id, node));
  const values: Array<number | null> = []; const queue: Array<string | null> = [root.id];
  while (queue.length) {
    const id = queue.shift()!;
    if (!id) { values.push(null); continue; }
    const node = nodes.get(id)!; values.push(node.value); queue.push(leftLinks[id] ?? null, rightLinks[id] ?? null);
  }
  while (values[values.length - 1] === null) values.pop();
  return values;
}
