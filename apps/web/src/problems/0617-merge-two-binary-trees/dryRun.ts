import type { FrameKind } from "../../shared/types";

type Node = { value: number; left: Node | null; right: Node | null };
export type MergeTreesFrame = {
  kind: FrameKind;
  phase: "start" | "merge" | "keep" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  firstValue: number | null;
  secondValue: number | null;
  mergedValue: number | null;
  tree: Array<number | null>;
  result: Array<number | null> | null;
};

export function createMergeTreesDryRun(firstValues: Array<number | null>, secondValues: Array<number | null>): { frames: MergeTreesFrame[] } {
  const first = buildTree(firstValues);
  const second = buildTree(secondValues);
  let output: Node | null = null;
  const frames: MergeTreesFrame[] = [];
  const push = (frame: Omit<MergeTreesFrame, "tree">) => frames.push({ ...frame, tree: serialize(output) });

  push({ kind: "start", phase: "start", title: "Merge from both roots", detail: "Overlapping positions are added; one-sided branches are kept.", activeLines: [2, 3], firstValue: first?.value ?? null, secondValue: second?.value ?? null, mergedValue: null, result: null });
  output = merge(first, second, null, "root");
  const result = serialize(output);
  push({ kind: "done", phase: "done", title: "Merged tree complete", detail: "Every position now contains the sum or the original one-sided node.", activeLines: [13], firstValue: null, secondValue: null, mergedValue: output?.value ?? null, result });
  return { frames };

  function merge(one: Node | null, two: Node | null, parent: Node | null, side: "root" | "left" | "right"): Node | null {
    if (!one || !two) {
      const kept = clone(one ?? two);
      attach(parent, side, kept);
      push({ kind: "build", phase: "keep", title: `Keep ${kept?.value ?? "empty"}`, detail: "Only one input has a node at this position, so it passes through unchanged.", activeLines: [3, 4], firstValue: one?.value ?? null, secondValue: two?.value ?? null, mergedValue: kept?.value ?? null, result: null });
      return kept;
    }
    const node: Node = { value: one.value + two.value, left: null, right: null };
    attach(parent, side, node);
    push({ kind: "found", phase: "merge", title: `${one.value} + ${two.value} = ${node.value}`, detail: "Create the output node, then merge its matching children.", activeLines: [5, 6, 7], firstValue: one.value, secondValue: two.value, mergedValue: node.value, result: null });
    node.left = merge(one.left, two.left, node, "left");
    node.right = merge(one.right, two.right, node, "right");
    return node;
  }

  function attach(parent: Node | null, side: "root" | "left" | "right", node: Node | null): void {
    if (!parent) output = node;
    else if (side === "left") parent.left = node;
    else parent.right = node;
  }
}

function buildTree(values: Array<number | null>): Node | null {
  if (typeof values[0] !== "number") return null;
  const root: Node = { value: values[0], left: null, right: null };
  const queue = [root];
  let cursor = 1;
  while (queue.length && cursor < values.length) {
    const node = queue.shift()!;
    const left = values[cursor++];
    if (typeof left === "number") { node.left = { value: left, left: null, right: null }; queue.push(node.left); }
    if (cursor >= values.length) break;
    const right = values[cursor++];
    if (typeof right === "number") { node.right = { value: right, left: null, right: null }; queue.push(node.right); }
  }
  return root;
}
function clone(node: Node | null): Node | null { return node ? { value: node.value, left: clone(node.left), right: clone(node.right) } : null; }
function serialize(root: Node | null): Array<number | null> {
  if (!root) return [];
  const result: Array<number | null> = [];
  const queue: Array<Node | null> = [root];
  while (queue.length) {
    const node = queue.shift()!;
    if (!node) { result.push(null); continue; }
    result.push(node.value); queue.push(node.left, node.right);
  }
  while (result[result.length - 1] === null) result.pop();
  return result;
}
