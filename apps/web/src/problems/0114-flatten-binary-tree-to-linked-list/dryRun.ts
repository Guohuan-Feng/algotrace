import type { FrameKind } from "../../shared/types";

type TreeNode = {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
};

export type FlattenTreeFrame = {
  kind: FrameKind;
  phase: "start" | "enter" | "rewire" | "promote" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  activeId: string | null;
  prevId: string | null;
  links: Record<string, string | null>;
  leftLinks: Record<string, string | null>;
  flattenedIds: string[];
  stack: string[];
  result: number[] | null;
};

export function createFlattenTreeDryRun(values: Array<number | null>): { frames: FlattenTreeFrame[] } {
  const root = buildTree(values);
  const frames: FlattenTreeFrame[] = [];
  const links: Record<string, string | null> = {};
  const leftLinks: Record<string, string | null> = {};
  const flattenedIds = new Set<string>();
  const stack: string[] = [];
  let prev: TreeNode | null = null;

  forEachNode(root, (node) => {
    links[node.id] = node.right?.id ?? null;
    leftLinks[node.id] = node.left?.id ?? null;
  });

  const push = (frame: Omit<FlattenTreeFrame, "links" | "leftLinks" | "flattenedIds" | "stack" | "prevId">) => {
    frames.push({
      ...frame,
      links: { ...links },
      leftLinks: { ...leftLinks },
      flattenedIds: [...flattenedIds],
      stack: [...stack],
      prevId: prev?.id ?? null,
    });
  };

  push({
    kind: "start",
    phase: "start",
    title: "Flatten in reverse preorder",
    detail: "Visit right, then left, so prev always points to the already-built suffix.",
    activeLines: [15],
    activeId: root?.id ?? null,
    result: null,
  });

  flatten(root);
  const result = followRightPointers(root, links);

  push({
    kind: "done",
    phase: "done",
    title: "Tree is now one right-only list",
    detail: `Preorder is ${result.length ? `[${result.join(", ")}]` : "[]"}; every left pointer is None.`,
    activeLines: [15],
    activeId: null,
    result,
  });

  return { frames };

  function flatten(node: TreeNode | null): void {
    if (!node) return;

    stack.push(`flatten(${node.value})`);
    push({
      kind: "visit",
      phase: "enter",
      title: `Enter ${node.value}`,
      detail: "Delay its pointer update until both original subtrees are flattened.",
      activeLines: [5],
      activeId: node.id,
      result: null,
    });

    flatten(node.right);
    flatten(node.left);

    links[node.id] = prev?.id ?? null;
    leftLinks[node.id] = null;
    flattenedIds.add(node.id);
    push({
      kind: "backtrack",
      phase: "rewire",
      title: `Rewrite pointers at ${node.value}`,
      detail: `${node.value}.right = ${prev?.value ?? "None"}; ${node.value}.left = None.`,
      activeLines: [10, 11],
      activeId: node.id,
      result: null,
    });

    prev = node;
    push({
      kind: "backtrack",
      phase: "promote",
      title: `Move prev to ${node.value}`,
      detail: `${node.value} becomes the head of the suffix built so far.`,
      activeLines: [12],
      activeId: node.id,
      result: null,
    });
    stack.pop();
  }
}

function buildTree(values: Array<number | null>): TreeNode | null {
  if (typeof values[0] !== "number") return null;

  const root: TreeNode = { id: "node-0", value: values[0], left: null, right: null };
  const queue = [root];
  let index = 1;

  while (queue.length && index < values.length) {
    const node = queue.shift()!;
    const leftValue = values[index];
    const leftIndex = index++;
    if (typeof leftValue === "number") {
      node.left = { id: `node-${leftIndex}`, value: leftValue, left: null, right: null };
      queue.push(node.left);
    }

    if (index >= values.length) break;
    const rightValue = values[index];
    const rightIndex = index++;
    if (typeof rightValue === "number") {
      node.right = { id: `node-${rightIndex}`, value: rightValue, left: null, right: null };
      queue.push(node.right);
    }
  }

  return root;
}

function forEachNode(root: TreeNode | null, visit: (node: TreeNode) => void): void {
  if (!root) return;
  visit(root);
  forEachNode(root.left, visit);
  forEachNode(root.right, visit);
}

function followRightPointers(root: TreeNode | null, links: Record<string, string | null>): number[] {
  const byId = new Map<string, number>();
  forEachNode(root, (node) => byId.set(node.id, node.value));

  const result: number[] = [];
  const seen = new Set<string>();
  let id = root?.id ?? null;
  while (id && !seen.has(id)) {
    seen.add(id);
    result.push(byId.get(id)!);
    id = links[id] ?? null;
  }
  return result;
}
