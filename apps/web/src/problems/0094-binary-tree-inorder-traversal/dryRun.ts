import type { FrameKind } from "../../shared/types";

type TreeNode = {
  id: string;
  index: number;
  layoutIndex: number;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
};

export type InorderTraversalFrame = {
  kind: FrameKind;
  phase: "start" | "enter" | "left" | "append" | "right" | "empty" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  activeId: string | null;
  activeValue: number | null;
  visitedIds: string[];
  stack: string[];
  result: number[];
};

export function createInorderTraversalDryRun(values: Array<number | null>): { frames: InorderTraversalFrame[] } {
  const root = buildTree(values, 0);
  const frames: InorderTraversalFrame[] = [];
  const result: number[] = [];
  const visitedIds = new Set<string>();
  const stack: string[] = [];

  const snapshot = (frame: Omit<InorderTraversalFrame, "visitedIds" | "stack" | "result">) => {
    frames.push({ ...frame, visitedIds: [...visitedIds], stack: [...stack], result: [...result] });
  };

  snapshot({
    kind: "start",
    phase: "start",
    title: "Start inorder traversal",
    detail: "Inorder always follows the same three beats: left subtree, current node, then right subtree.",
    activeLines: [3, 12],
    activeId: root?.id ?? null,
    activeValue: root?.value ?? null,
  });

  dfs(root);

  snapshot({
    kind: "done",
    phase: "done",
    title: "Return the inorder values",
    detail: "Every node has been appended only after its whole left subtree is complete.",
    activeLines: [13],
    activeId: null,
    activeValue: null,
  });

  return { frames };

  function dfs(node: TreeNode | null): void {
    if (!node) {
      snapshot({
        kind: "prune",
        phase: "empty",
        title: "Reach an empty child",
        detail: "There is no node here, so this recursive call returns immediately.",
        activeLines: [6, 7],
        activeId: null,
        activeValue: null,
      });
      return;
    }

    stack.push(`dfs(${node.value})`);
    snapshot({
      kind: "visit",
      phase: "enter",
      title: `Enter node ${node.value}`,
      detail: `Do not append ${node.value} yet. First finish its left subtree.`,
      activeLines: [5, 6],
      activeId: node.id,
      activeValue: node.value,
    });

    snapshot({
      kind: "start",
      phase: "left",
      title: `Traverse left of ${node.value}`,
      detail: `Call dfs(node.left) before visiting ${node.value}.`,
      activeLines: [9],
      activeId: node.left?.id ?? node.id,
      activeValue: node.left?.value ?? node.value,
    });
    dfs(node.left);

    result.push(node.value);
    visitedIds.add(node.id);
    snapshot({
      kind: "found",
      phase: "append",
      title: `Append ${node.value}`,
      detail: `The left subtree is finished, so append ${node.value} to res.`,
      activeLines: [10],
      activeId: node.id,
      activeValue: node.value,
    });

    snapshot({
      kind: "start",
      phase: "right",
      title: `Traverse right of ${node.value}`,
      detail: `Now visit every value in the right subtree of ${node.value}.`,
      activeLines: [11],
      activeId: node.right?.id ?? node.id,
      activeValue: node.right?.value ?? node.value,
    });
    dfs(node.right);

    stack.pop();
  }
}

function buildTree(values: Array<number | null>, index: number): TreeNode | null {
  const rootValue = values[index];
  if (rootValue === null || rootValue === undefined) return null;

  const root: TreeNode = { id: `node-${index}`, index, layoutIndex: 0, value: rootValue, left: null, right: null };
  const queue: TreeNode[] = [root];
  let cursor = index + 1;

  while (queue.length && cursor < values.length) {
    const node = queue.shift()!;
    const leftValue = values[cursor];
    const leftIndex = cursor;
    cursor += 1;
    if (typeof leftValue === "number") {
      node.left = { id: `node-${leftIndex}`, index: leftIndex, layoutIndex: node.layoutIndex * 2 + 1, value: leftValue, left: null, right: null };
      queue.push(node.left);
    }

    if (cursor >= values.length) break;
    const rightValue = values[cursor];
    const rightIndex = cursor;
    cursor += 1;
    if (typeof rightValue === "number") {
      node.right = { id: `node-${rightIndex}`, index: rightIndex, layoutIndex: node.layoutIndex * 2 + 2, value: rightValue, left: null, right: null };
      queue.push(node.right);
    }
  }

  return root;
}

export function flattenTree(values: Array<number | null>): Array<{ id: string; parentId: string | null; side: "left" | "right" | "root"; value: number; index: number; layoutIndex: number }> {
  const root = buildTree(values, 0);
  const nodes: Array<{ id: string; parentId: string | null; side: "left" | "right" | "root"; value: number; index: number; layoutIndex: number }> = [];

  function visit(node: TreeNode | null, parentId: string | null, side: "left" | "right" | "root"): void {
    if (!node) return;
    nodes.push({ id: node.id, parentId, side, value: node.value, index: node.index, layoutIndex: node.layoutIndex });
    visit(node.left, node.id, "left");
    visit(node.right, node.id, "right");
  }

  visit(root, null, "root");
  return nodes;
}
