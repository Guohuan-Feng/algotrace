import type { FrameKind } from "../../shared/types";

type Node = { value: number; left: Node | null; right: Node | null };
export type MaximumBinaryTreeFrame = {
  kind: FrameKind;
  phase: "start" | "scan" | "choose" | "empty" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  range: [number, number];
  scanIndex: number | null;
  chosenValue: number | null;
  tree: Array<number | null>;
  result: Array<number | null> | null;
};

export function createMaximumBinaryTreeDryRun(nums: number[]): { frames: MaximumBinaryTreeFrame[] } {
  let root: Node | null = null;
  const frames: MaximumBinaryTreeFrame[] = [];
  const push = (frame: Omit<MaximumBinaryTreeFrame, "tree">) => frames.push({ ...frame, tree: serialize(root) });

  push({ kind: "start", phase: "start", title: "Build from the full array", detail: "The maximum in each range becomes that range's tree root.", activeLines: [2, 13], range: [0, nums.length - 1], scanIndex: null, chosenValue: null, result: null });
  root = build(0, nums.length - 1, null, "root");
  const result = serialize(root);
  push({ kind: "done", phase: "done", title: "Maximum binary tree complete", detail: "Each chosen maximum has recursively split its left and right ranges.", activeLines: [13], range: [0, nums.length - 1], scanIndex: null, chosenValue: root?.value ?? null, result });
  return { frames };

  function build(left: number, right: number, parent: Node | null, side: "root" | "left" | "right"): Node | null {
    if (left > right) {
      push({ kind: "prune", phase: "empty", title: "Empty range returns None", detail: "There is no value to place in this child position.", activeLines: [3, 4], range: [left, right], scanIndex: null, chosenValue: null, result: null });
      return null;
    }
    let maxIndex = left;
    for (let index = left; index <= right; index += 1) {
      if (nums[index]! > nums[maxIndex]!) maxIndex = index;
      push({ kind: "visit", phase: "scan", title: `Inspect ${nums[index]} in [${left}, ${right}]`, detail: `Largest value seen in this range is ${nums[maxIndex]}.`, activeLines: [5, 6, 7], range: [left, right], scanIndex: index, chosenValue: nums[maxIndex]!, result: null });
    }
    const node: Node = { value: nums[maxIndex]!, left: null, right: null };
    if (!parent) root = node;
    else if (side === "left") parent.left = node;
    else parent.right = node;
    push({ kind: "found", phase: "choose", title: `Choose ${node.value} as this range root`, detail: `Split the remaining values at index ${maxIndex}.`, activeLines: [8, 9], range: [left, right], scanIndex: maxIndex, chosenValue: node.value, result: null });
    node.left = build(left, maxIndex - 1, node, "left");
    node.right = build(maxIndex + 1, right, node, "right");
    return node;
  }
}

function serialize(root: Node | null): Array<number | null> {
  if (!root) return [];
  const result: Array<number | null> = [], queue: Array<Node | null> = [root];
  while (queue.length) {
    const node = queue.shift()!;
    if (!node) { result.push(null); continue; }
    result.push(node.value); queue.push(node.left, node.right);
  }
  while (result[result.length - 1] === null) result.pop();
  return result;
}
