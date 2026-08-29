import type { FrameKind } from "../../shared/types";

type TreeNode = {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
};

export type NextPointerFrame = {
  kind: FrameKind;
  phase: "start" | "level" | "dequeue" | "connect" | "enqueue" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  activeId: string | null;
  targetId: string | null;
  queue: number[];
  currentLevel: number[];
  processedIds: string[];
  nextLinks: Record<string, string | null>;
  result: string[] | null;
};

export function createConnectNextPointersDryRun(values: Array<number | null>): { frames: NextPointerFrame[] } {
  const root = buildTree(values);
  const frames: NextPointerFrame[] = [];
  const queue: TreeNode[] = [];
  const processedIds = new Set<string>();
  const nextLinks: Record<string, string | null> = {};
  let currentLevel: number[] = [];

  forEachNode(root, (node) => { nextLinks[node.id] = null; });

  const push = (frame: Omit<NextPointerFrame, "queue" | "currentLevel" | "processedIds" | "nextLinks">) => {
    frames.push({
      ...frame,
      queue: queue.map((node) => node.value),
      currentLevel: [...currentLevel],
      processedIds: [...processedIds],
      nextLinks: { ...nextLinks },
    });
  };

  push({
    kind: "start",
    phase: "start",
    title: "Connect nodes one level at a time",
    detail: "A BFS queue keeps each tree level in left-to-right order.",
    activeLines: [17],
    activeId: root?.id ?? null,
    targetId: null,
    result: null,
  });

  if (!root) {
    push({ kind: "done", phase: "done", title: "Empty tree", detail: "There are no next pointers to populate.", activeLines: [17], activeId: null, targetId: null, result: [] });
    return { frames };
  }

  queue.push(root);
  while (queue.length) {
    const levelSize = queue.length;
    let prev: TreeNode | null = null;
    currentLevel = [];
    push({
      kind: "build",
      phase: "level",
      title: `Start a level with ${levelSize} node${levelSize === 1 ? "" : "s"}`,
      detail: "prev resets to None; only nodes in this level may receive next pointers.",
      activeLines: [8, 9],
      activeId: null,
      targetId: null,
      result: null,
    });

    for (let index = 0; index < levelSize; index += 1) {
      const node = queue.shift()!;
      currentLevel.push(node.value);
      processedIds.add(node.id);
      push({
        kind: "visit",
        phase: "dequeue",
        title: `Dequeue ${node.value}`,
        detail: "This is the next node in the current level.",
        activeLines: [10],
        activeId: node.id,
        targetId: null,
        result: null,
      });

      if (prev) {
        nextLinks[prev.id] = node.id;
        push({
          kind: "backtrack",
          phase: "connect",
          title: `Set ${prev.value}.next = ${node.value}`,
          detail: "The green arrow connects adjacent nodes in the same level.",
          activeLines: [12, 13],
          activeId: prev.id,
          targetId: node.id,
          result: null,
        });
      }
      prev = node;

      for (const child of [node.left, node.right]) {
        if (!child) continue;
        queue.push(child);
        push({
          kind: "build",
          phase: "enqueue",
          title: `Queue child ${child.value}`,
          detail: "It will be connected when its own level begins.",
          activeLines: [15, 16],
          activeId: node.id,
          targetId: child.id,
          result: null,
        });
      }
    }
  }

  push({
    kind: "done",
    phase: "done",
    title: "Every level is connected",
    detail: "The last node of each level keeps next = None.",
    activeLines: [17],
    activeId: null,
    targetId: null,
    result: formatLevels(root, nextLinks),
  });

  return { frames };
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
  visit(root);
  forEachNode(root.left, visit);
  forEachNode(root.right, visit);
}

function formatLevels(root: TreeNode, nextLinks: Record<string, string | null>): string[] {
  const byId = new Map<string, TreeNode>();
  forEachNode(root, (node) => byId.set(node.id, node));
  const result: string[] = [];
  const queue = [root];
  while (queue.length) {
    const size = queue.length;
    const first = queue[0]!;
    const values: number[] = [];
    let id: string | null = first.id;
    while (id) { const node = byId.get(id)!; values.push(node.value); id = nextLinks[id] ?? null; }
    result.push(`${values.join(" -> ")} -> #`);
    for (let index = 0; index < size; index += 1) {
      const node = queue.shift()!;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return result;
}
