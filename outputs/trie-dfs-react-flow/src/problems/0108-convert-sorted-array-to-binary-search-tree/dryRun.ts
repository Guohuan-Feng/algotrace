import type { FrameKind } from "../../types";

export type BstBuildNode = {
  id: string;
  value: number;
  left: number;
  right: number;
  mid: number;
  depth: number;
  parentId: string | null;
  side: "root" | "left" | "right";
};

export type SortedArrayToBstFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  activeNodeId: string | null;
  activeRange: [number, number] | null;
  mid: number | null;
  nodes: BstBuildNode[];
  completedIds: string[];
  stack: string[];
  returnValue: string;
};

export function createSortedArrayToBstDryRun(nums: number[]): { frames: SortedArrayToBstFrame[] } {
  const frames: SortedArrayToBstFrame[] = [];
  const nodes = new Map<string, BstBuildNode>();
  const completedIds = new Set<string>();
  const stack: string[] = [];

  const pushFrame = (frame: Omit<SortedArrayToBstFrame, "nodes" | "completedIds" | "stack"> & { stack?: string[] }) => {
    frames.push({
      ...frame,
      nodes: [...nodes.values()],
      completedIds: [...completedIds],
      stack: frame.stack ?? [...stack],
    });
  };

  pushFrame({
    kind: "start",
    title: "Start build",
    detail: `Call build(0, ${nums.length - 1}) for the full sorted array.`,
    activeLines: [18],
    activeNodeId: null,
    activeRange: [0, nums.length - 1],
    mid: null,
    returnValue: "pending",
    stack: [`build(0, ${nums.length - 1})`],
  });

  const rootId = build(0, nums.length - 1, 0, null, "root");

  pushFrame({
    kind: "done",
    title: "Return root",
    detail: rootId ? `The balanced BST root is nums[mid] = ${nodes.get(rootId)?.value}.` : "The input array is empty, so the tree is None.",
    activeLines: [18],
    activeNodeId: rootId,
    activeRange: null,
    mid: null,
    returnValue: rootId ? `TreeNode(${nodes.get(rootId)?.value})` : "None",
    stack: ["return root"],
  });

  return { frames };

  function build(left: number, right: number, depth: number, parentId: string | null, side: BstBuildNode["side"]): string | null {
    const label = `build(${left}, ${right})`;
    stack.push(label);

    pushFrame({
      kind: "visit",
      title: `Enter ${label}`,
      detail: `Build a subtree from nums[${left}..${right}].`,
      activeLines: [5, 6],
      activeNodeId: parentId,
      activeRange: [left, right],
      mid: null,
      returnValue: "pending",
    });

    if (left > right) {
      pushFrame({
        kind: "prune",
        title: "Empty range",
        detail: `left > right (${left} > ${right}), so this child is None.`,
        activeLines: [6, 7],
        activeNodeId: parentId,
        activeRange: [left, right],
        mid: null,
        returnValue: "None",
      });
      stack.pop();
      return null;
    }

    const mid = Math.floor((left + right) / 2);
    pushFrame({
      kind: "start",
      title: `Pick mid = ${mid}`,
      detail: `mid = (${left} + ${right}) // 2. nums[${mid}] = ${nums[mid]} becomes this subtree root.`,
      activeLines: [9],
      activeNodeId: parentId,
      activeRange: [left, right],
      mid,
      returnValue: "pending",
    });

    const nodeId = nodeIdForRange(left, right, side, depth);
    nodes.set(nodeId, {
      id: nodeId,
      value: nums[mid],
      left,
      right,
      mid,
      depth,
      parentId,
      side,
    });

    pushFrame({
      kind: "build",
      title: `Create TreeNode(${nums[mid]})`,
      detail: `Use the middle value so the left and right subtree sizes stay balanced.`,
      activeLines: [11],
      activeNodeId: nodeId,
      activeRange: [left, right],
      mid,
      returnValue: `TreeNode(${nums[mid]})`,
    });

    pushFrame({
      kind: "start",
      title: "Build left subtree",
      detail: `root.left = build(${left}, ${mid - 1}).`,
      activeLines: [13],
      activeNodeId: nodeId,
      activeRange: [left, mid - 1],
      mid: null,
      returnValue: "pending",
    });
    build(left, mid - 1, depth + 1, nodeId, "left");

    pushFrame({
      kind: "start",
      title: "Build right subtree",
      detail: `root.right = build(${mid + 1}, ${right}).`,
      activeLines: [14],
      activeNodeId: nodeId,
      activeRange: [mid + 1, right],
      mid: null,
      returnValue: "pending",
    });
    build(mid + 1, right, depth + 1, nodeId, "right");

    completedIds.add(nodeId);
    pushFrame({
      kind: "backtrack",
      title: `Return TreeNode(${nums[mid]})`,
      detail: `Both children are assigned, so build(${left}, ${right}) returns this root.`,
      activeLines: [16],
      activeNodeId: nodeId,
      activeRange: [left, right],
      mid,
      returnValue: `TreeNode(${nums[mid]})`,
    });

    stack.pop();
    return nodeId;
  }
}

export function nodeIdForRange(left: number, right: number, side: string, depth: number): string {
  return `bst-${depth}-${side}-${left}-${right}`;
}
