import type { FrameKind } from "../../shared/types";

type Node = { value: number; left: Node | null; right: Node | null };
export type RemoveLeafFrame = {
  kind: FrameKind;
  phase: "start" | "visit" | "remove" | "keep" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  activeValue: number | null;
  target: number;
  tree: Array<number | null>;
  result: Array<number | null> | null;
};

export function createRemoveLeafNodesDryRun(values: Array<number | null>, target: number): { frames: RemoveLeafFrame[] } {
  let root = buildTree(values);
  const frames: RemoveLeafFrame[] = [];
  const push = (frame: Omit<RemoveLeafFrame, "tree" | "target">) => frames.push({ ...frame, target, tree: serialize(root) });

  push({ kind: "start", phase: "start", title: `Delete target leaves: ${target}`, detail: "Postorder traversal removes children before rechecking their parent.", activeLines: [2, 3], activeValue: root?.value ?? null, result: null });
  root = prune(root);
  const result = serialize(root);
  push({ kind: "done", phase: "done", title: "Pruning complete", detail: "A parent can disappear after its target-valued children are removed.", activeLines: [11], activeValue: null, result });
  return { frames };

  function prune(node: Node | null): Node | null {
    if (!node) return null;
    push({ kind: "visit", phase: "visit", title: `Visit ${node.value}`, detail: "First prune both children so this node can become a new leaf.", activeLines: [4, 5, 6], activeValue: node.value, result: null });
    node.left = prune(node.left);
    node.right = prune(node.right);
    if (node.value === target && !node.left && !node.right) {
      push({ kind: "found", phase: "remove", title: `Remove leaf ${node.value}`, detail: "It equals the target and has no children after postorder pruning.", activeLines: [7, 8], activeValue: node.value, result: null });
      return null;
    }
    push({ kind: "build", phase: "keep", title: `Keep ${node.value}`, detail: "It either differs from the target or still has a child.", activeLines: [9, 10], activeValue: node.value, result: null });
    return node;
  }
}

function buildTree(values: Array<number | null>): Node | null {
  if (typeof values[0] !== "number") return null;
  const root: Node = { value: values[0], left: null, right: null }, queue = [root]; let cursor = 1;
  while (queue.length && cursor < values.length) {
    const node = queue.shift()!;
    const left = values[cursor++]; if (typeof left === "number") { node.left = { value: left, left: null, right: null }; queue.push(node.left); }
    if (cursor >= values.length) break;
    const right = values[cursor++]; if (typeof right === "number") { node.right = { value: right, left: null, right: null }; queue.push(node.right); }
  }
  return root;
}
function serialize(root: Node | null): Array<number | null> {
  if (!root) return [];
  const result: Array<number | null> = [], queue: Array<Node | null> = [root];
  while (queue.length) { const node = queue.shift()!; if (!node) { result.push(null); continue; } result.push(node.value); queue.push(node.left, node.right); }
  while (result[result.length - 1] === null) result.pop();
  return result;
}
