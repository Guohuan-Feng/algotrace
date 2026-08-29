import type { FrameKind } from "../../shared/types";

type TreeNode = { id: string; value: number; left: TreeNode | null; right: TreeNode | null };
type Choice = { rob: number; skip: number };

export type HouseRobberTreeFrame = {
  kind: FrameKind;
  phase: "start" | "enter" | "combine" | "return" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  activeId: string | null;
  choices: Record<string, Choice>;
  rob: number | null;
  skip: number | null;
  stack: string[];
  result: number | null;
};

export function createHouseRobberTreeDryRun(values: Array<number | null>): { frames: HouseRobberTreeFrame[] } {
  const root = buildTree(values);
  const frames: HouseRobberTreeFrame[] = [];
  const choices: Record<string, Choice> = {};
  const stack: string[] = [];
  const push = (frame: Omit<HouseRobberTreeFrame, "choices" | "stack">) => frames.push({ ...frame, choices: { ...choices }, stack: [...stack] });

  push({ kind: "start", phase: "start", title: "Start postorder tree DP", detail: "Each node returns two totals: rob this node, or skip this node.", activeLines: [2, 3, 14], activeId: root?.id ?? null, rob: null, skip: null, result: null });
  const answer = dfs(root);
  const result = Math.max(answer.rob, answer.skip);
  push({ kind: "done", phase: "done", title: `Maximum amount = ${result}`, detail: "At the root, choose the better of its rob and skip states.", activeLines: [14], activeId: null, rob: answer.rob, skip: answer.skip, result });
  return { frames };

  function dfs(node: TreeNode | null): Choice {
    if (!node) return { rob: 0, skip: 0 };
    stack.push(`dfs(${node.value})`);
    push({ kind: "visit", phase: "enter", title: `Visit ${node.value}`, detail: "Recurse into both children before deciding whether this node can be robbed.", activeLines: [3, 4, 7, 8], activeId: node.id, rob: null, skip: null, result: null });
    const left = dfs(node.left);
    const right = dfs(node.right);
    const rob = node.value + left.skip + right.skip;
    const skip = Math.max(left.rob, left.skip) + Math.max(right.rob, right.skip);
    push({ kind: "visit", phase: "combine", title: `Compare rob ${rob} vs skip ${skip} at ${node.value}`, detail: `Rob uses children skip values ${left.skip} + ${right.skip}; skip may take each child's best value.`, activeLines: [10, 11], activeId: node.id, rob, skip, result: null });
    choices[node.id] = { rob, skip };
    push({ kind: "backtrack", phase: "return", title: `Return (${rob}, ${skip}) from ${node.value}`, detail: "The parent receives both possibilities so it can respect the no-adjacent-houses rule.", activeLines: [12], activeId: node.id, rob, skip, result: null });
    stack.pop();
    return { rob, skip };
  }
}

function buildTree(values: Array<number | null>): TreeNode | null {
  if (typeof values[0] !== "number") return null;
  const root: TreeNode = { id: "node-0", value: values[0], left: null, right: null };
  const queue = [root];
  let cursor = 1;
  while (queue.length && cursor < values.length) {
    const node = queue.shift()!;
    const left = values[cursor]; const leftIndex = cursor; cursor += 1;
    if (typeof left === "number") { node.left = { id: `node-${leftIndex}`, value: left, left: null, right: null }; queue.push(node.left); }
    if (cursor >= values.length) break;
    const right = values[cursor]; const rightIndex = cursor; cursor += 1;
    if (typeof right === "number") { node.right = { id: `node-${rightIndex}`, value: right, left: null, right: null }; queue.push(node.right); }
  }
  return root;
}
