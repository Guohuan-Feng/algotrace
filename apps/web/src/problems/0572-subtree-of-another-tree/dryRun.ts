import type { FrameKind } from "../../shared/types";

type Node = { id: string; value: number; left: Node | null; right: Node | null };
export type SubtreeFrame = {
  kind: FrameKind;
  phase: "start" | "candidate" | "compare" | "mismatch" | "match" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  activeRootValue: number | null;
  comparedValue: number | null;
  tree: Array<number | null>;
  result: boolean | null;
};

export function createSubtreeDryRun(rootValues: Array<number | null>, subRootValues: Array<number | null>): { frames: SubtreeFrame[] } {
  const root = buildTree(rootValues, "root");
  const subRoot = buildTree(subRootValues, "sub");
  const frames: SubtreeFrame[] = [];
  const push = (frame: Omit<SubtreeFrame, "tree">) => frames.push({ ...frame, tree: [...rootValues] });

  push({ kind: "start", phase: "start", title: "Search every root node", detail: "At each node, first ask whether the entire structure equals subRoot.", activeLines: [2, 3, 12], activeRootValue: root?.value ?? null, comparedValue: subRoot?.value ?? null, result: null });
  const result = isSubtree(root);
  push({ kind: "done", phase: "done", title: result ? "subRoot is a subtree" : "No matching subtree", detail: result ? "One candidate matched every value and child position." : "Every candidate had a different value or shape.", activeLines: [16], activeRootValue: null, comparedValue: null, result });
  return { frames };

  function isSubtree(node: Node | null): boolean {
    if (!node) return false;
    push({ kind: "visit", phase: "candidate", title: `Try ${node.value} as a candidate root`, detail: "The match must start at this node and include its whole subtree.", activeLines: [12, 13], activeRootValue: node.value, comparedValue: subRoot?.value ?? null, result: null });
    if (sameTree(node, subRoot, node.value)) {
      push({ kind: "found", phase: "match", title: `Candidate ${node.value} matches`, detail: "Both values and the left/right structure are identical.", activeLines: [13], activeRootValue: node.value, comparedValue: subRoot?.value ?? null, result: null });
      return true;
    }
    return isSubtree(node.left) || isSubtree(node.right);
  }

  function sameTree(first: Node | null, second: Node | null, candidate: number): boolean {
    if (!first || !second) {
      const equal = first === second;
      if (!equal) push({ kind: "prune", phase: "mismatch", title: "One tree ended first", detail: "Different shapes cannot form identical trees.", activeLines: [4, 5], activeRootValue: candidate, comparedValue: second?.value ?? null, result: null });
      return equal;
    }
    push({ kind: "visit", phase: "compare", title: `Compare ${first.value} with ${second.value}`, detail: "Both the current values and both child pairs must agree.", activeLines: [6, 7], activeRootValue: candidate, comparedValue: second.value, result: null });
    if (first.value !== second.value) {
      push({ kind: "prune", phase: "mismatch", title: `${first.value} does not equal ${second.value}`, detail: "Reject this candidate and continue the outer DFS.", activeLines: [7], activeRootValue: candidate, comparedValue: second.value, result: null });
      return false;
    }
    return sameTree(first.left, second.left, candidate) && sameTree(first.right, second.right, candidate);
  }
}

function buildTree(values: Array<number | null>, prefix: string): Node | null {
  if (typeof values[0] !== "number") return null;
  const root: Node = { id: `${prefix}-0`, value: values[0], left: null, right: null };
  const queue = [root];
  let cursor = 1;
  while (queue.length && cursor < values.length) {
    const node = queue.shift()!;
    for (const side of ["left", "right"] as const) {
      const value = values[cursor];
      const index = cursor++;
      if (typeof value === "number") {
        const child: Node = { id: `${prefix}-${index}`, value, left: null, right: null };
        node[side] = child;
        queue.push(child);
      }
      if (cursor >= values.length && side === "left") break;
    }
  }
  return root;
}
