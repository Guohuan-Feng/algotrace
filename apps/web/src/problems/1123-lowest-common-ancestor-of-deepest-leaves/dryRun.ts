import type { TreeTraceFrame } from "../../shared/components/TreeTraceVisualizer";

type Node = { id: string; value: number; left: Node | null; right: Node | null };
export type LcaDeepestFrame = TreeTraceFrame & {
  phase: "start" | "visit" | "leaf" | "lca" | "return" | "done";
  depth: number;
  lcaValue: number | null;
};

export function createLcaDeepestLeavesDryRun(values: Array<number | null>): { frames: LcaDeepestFrame[] } {
  const root = buildTree(values);
  const frames: LcaDeepestFrame[] = [];
  const completed = new Set<string>();
  let lcaValue: number | null = null;
  const push = (frame: Omit<LcaDeepestFrame, "completedIds" | "depth" | "lcaValue"> & { depth?: number; lcaValue?: number | null }) => {
    frames.push({ ...frame, depth: frame.depth ?? 0, lcaValue: frame.lcaValue ?? lcaValue, completedIds: [...completed] });
  };

  push({ kind: "start", phase: "start", title: "Return deepest depth from both children", detail: "A recursive call returns its deepest leaf depth and the ancestor that covers it.", activeLines: [2, 14], activeId: root?.id ?? null, result: null });
  const answer = dfs(root, 0);
  lcaValue = answer.node?.value ?? null;
  push({ kind: "done", phase: "done", title: `Lowest common ancestor = ${lcaValue ?? "None"}`, detail: "The final returned node covers every deepest leaf.", activeLines: [14], activeId: null, result: lcaValue });
  return { frames };

  function dfs(node: Node | null, depth: number): { node: Node | null; depth: number } {
    if (!node) return { node: null, depth };
    push({ kind: "visit", phase: "visit", title: `Visit ${node.value}`, detail: "Find the deepest result from its left and right children.", activeLines: [3, 4], activeId: node.id, result: null, depth });
    if (!node.left && !node.right) {
      completed.add(node.id);
      push({ kind: "found", phase: "leaf", title: `${node.value} is a leaf at depth ${depth}`, detail: "This leaf becomes a candidate for the deepest set.", activeLines: [5, 6], activeId: node.id, result: null, depth });
      return { node, depth };
    }
    const left = dfs(node.left, depth + 1);
    const right = dfs(node.right, depth + 1);
    let chosen: { node: Node | null; depth: number };
    if (left.depth === right.depth) {
      chosen = { node, depth: left.depth };
      lcaValue = node.value;
      push({ kind: "found", phase: "lca", title: `${node.value} joins equally deep leaves`, detail: "Both subtrees reach the same deepest depth, so this node is their LCA.", activeLines: [9, 10], activeId: node.id, result: null, depth: left.depth, lcaValue: node.value });
    } else {
      chosen = left.depth > right.depth ? left : right;
      push({ kind: "build", phase: "return", title: `Return deeper ${chosen.node?.value ?? "None"} branch`, detail: "Only the deeper child can still contain the deepest leaves.", activeLines: [11, 12], activeId: node.id, result: null, depth: chosen.depth, lcaValue: chosen.node?.value ?? null });
    }
    completed.add(node.id);
    return chosen;
  }
}

function buildTree(values: Array<number | null>): Node | null {
  if (typeof values[0] !== "number") return null;
  const root: Node = { id: "node-0", value: values[0], left: null, right: null };
  const queue = [root]; let cursor = 1;
  while (queue.length && cursor < values.length) {
    const node = queue.shift()!;
    const left = values[cursor], leftIndex = cursor++;
    if (typeof left === "number") { node.left = { id: `node-${leftIndex}`, value: left, left: null, right: null }; queue.push(node.left); }
    if (cursor >= values.length) break;
    const right = values[cursor], rightIndex = cursor++;
    if (typeof right === "number") { node.right = { id: `node-${rightIndex}`, value: right, left: null, right: null }; queue.push(node.right); }
  }
  return root;
}
