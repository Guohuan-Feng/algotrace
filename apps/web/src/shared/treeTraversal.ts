import type { FrameKind } from "./types";

type TraversalOrder = "preorder" | "postorder";

type BinaryNode = {
  id: string;
  index: number;
  layoutIndex: number;
  value: number;
  left: BinaryNode | null;
  right: BinaryNode | null;
};

export type TreeTraversalFrame = {
  kind: FrameKind;
  phase: "start" | "enter" | "left" | "right" | "append" | "empty" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  activeId: string | null;
  activeValue: number | null;
  visitedIds: string[];
  stack: string[];
  result: number[];
};

export type FlatBinaryNode = { id: string; parentId: string | null; side: "left" | "right" | "root"; value: number; index: number; layoutIndex: number };

export function createRecursiveTreeTraversalDryRun(values: Array<number | null>, order: TraversalOrder): { frames: TreeTraversalFrame[] } {
  const root = buildTree(values);
  const frames: TreeTraversalFrame[] = [];
  const result: number[] = [];
  const visitedIds = new Set<string>();
  const stack: string[] = [];
  const mode = order === "preorder" ? "preorder" : "postorder";
  const snapshot = (frame: Omit<TreeTraversalFrame, "visitedIds" | "stack" | "result">) => frames.push({ ...frame, visitedIds: [...visitedIds], stack: [...stack], result: [...result] });

  snapshot({ kind: "start", phase: "start", title: `Start ${mode} traversal`, detail: order === "preorder" ? "Preorder appends a node before recursing into its children." : "Postorder appends a node only after both children return.", activeLines: [3, 13], activeId: root?.id ?? null, activeValue: root?.value ?? null });
  dfs(root);
  snapshot({ kind: "done", phase: "done", title: `Return the ${mode} values`, detail: order === "preorder" ? "Every value was recorded before its subtree calls." : "Every value was recorded after its subtree calls.", activeLines: [14], activeId: null, activeValue: null });
  return { frames };

  function dfs(node: BinaryNode | null): void {
    if (!node) {
      snapshot({ kind: "prune", phase: "empty", title: "Reach an empty child", detail: "This recursive call has no node to process, so it returns immediately.", activeLines: [6, 7], activeId: null, activeValue: null });
      return;
    }

    stack.push(`dfs(${node.value})`);
    snapshot({ kind: "visit", phase: "enter", title: `Enter node ${node.value}`, detail: order === "preorder" ? `Append ${node.value} before either recursive call.` : `Wait to append ${node.value} until both recursive calls finish.`, activeLines: [5, 6], activeId: node.id, activeValue: node.value });

    if (order === "preorder") append(node, 9, "before");
    visitChild(node, "left", 10);
    dfs(node.left);
    visitChild(node, "right", 11);
    dfs(node.right);
    if (order === "postorder") append(node, 11, "after");
    stack.pop();
  }

  function append(node: BinaryNode, line: number, timing: "before" | "after"): void {
    result.push(node.value);
    visitedIds.add(node.id);
    snapshot({ kind: "found", phase: "append", title: `Append ${node.value}`, detail: timing === "before" ? `Record ${node.value} before visiting its left and right children.` : `Both subtrees are finished, so record ${node.value} now.`, activeLines: [line], activeId: node.id, activeValue: node.value });
  }

  function visitChild(node: BinaryNode, side: "left" | "right", line: number): void {
    const child = node[side];
    snapshot({ kind: "start", phase: side, title: `Traverse ${side} of ${node.value}`, detail: child ? `Call dfs(node.${side}) for ${child.value}.` : `Call dfs(node.${side}); this child is empty.`, activeLines: [line], activeId: child?.id ?? node.id, activeValue: child?.value ?? node.value });
  }
}

export function flattenBinaryTree(values: Array<number | null>): FlatBinaryNode[] {
  const root = buildTree(values);
  const nodes: FlatBinaryNode[] = [];
  const visit = (node: BinaryNode | null, parentId: string | null, side: FlatBinaryNode["side"]): void => { if (!node) return; nodes.push({ id: node.id, parentId, side, value: node.value, index: node.index, layoutIndex: node.layoutIndex }); visit(node.left, node.id, "left"); visit(node.right, node.id, "right"); };
  visit(root, null, "root");
  return nodes;
}

function buildTree(values: Array<number | null>): BinaryNode | null {
  const rootValue = values[0];
  if (typeof rootValue !== "number") return null;
  const root: BinaryNode = { id: "node-0", index: 0, layoutIndex: 0, value: rootValue, left: null, right: null };
  const queue: BinaryNode[] = [root];
  let cursor = 1;
  while (queue.length && cursor < values.length) {
    const node = queue.shift()!;
    const leftIndex = cursor;
    const leftValue = values[cursor++];
    if (typeof leftValue === "number") { node.left = { id: `node-${leftIndex}`, index: leftIndex, layoutIndex: node.layoutIndex * 2 + 1, value: leftValue, left: null, right: null }; queue.push(node.left); }
    if (cursor >= values.length) break;
    const rightIndex = cursor;
    const rightValue = values[cursor++];
    if (typeof rightValue === "number") { node.right = { id: `node-${rightIndex}`, index: rightIndex, layoutIndex: node.layoutIndex * 2 + 2, value: rightValue, left: null, right: null }; queue.push(node.right); }
  }
  return root;
}
