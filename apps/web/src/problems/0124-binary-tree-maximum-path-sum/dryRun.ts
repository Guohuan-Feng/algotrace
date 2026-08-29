import type { FrameKind } from "../../shared/types";

type TreeNode = { id: string; value: number; left: TreeNode | null; right: TreeNode | null };
type Gain = { gain: number; chain: TreeNode[] };

export type MaximumPathSumFrame = {
  kind: FrameKind;
  phase: "start" | "enter" | "ignore" | "compare" | "gain" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  activeId: string | null;
  gains: Record<string, number>;
  leftGain: number | null;
  rightGain: number | null;
  throughSum: number | null;
  maxSum: number | null;
  bestPathIds: string[];
  bestPathValues: number[];
  stack: string[];
  result: number | null;
};

export function createMaximumPathSumDryRun(values: Array<number | null>): { frames: MaximumPathSumFrame[] } {
  const root = buildTree(values);
  const frames: MaximumPathSumFrame[] = [];
  const gains: Record<string, number> = {};
  const stack: string[] = [];
  let maxSum = Number.NEGATIVE_INFINITY;
  let bestPath: TreeNode[] = [];
  const push = (frame: Omit<MaximumPathSumFrame, "gains" | "maxSum" | "bestPathIds" | "bestPathValues" | "stack">) => frames.push({
    ...frame,
    gains: { ...gains },
    maxSum: Number.isFinite(maxSum) ? maxSum : null,
    bestPathIds: bestPath.map((node) => node.id),
    bestPathValues: bestPath.map((node) => node.value),
    stack: [...stack],
  });

  push({ kind: "start", phase: "start", title: "Start a postorder DFS", detail: "Each node returns one downward gain, while max_sum may use both children to make a complete path.", activeLines: [3, 16], activeId: root?.id ?? null, leftGain: null, rightGain: null, throughSum: null, result: null });

  if (!root) {
    push({ kind: "done", phase: "done", title: "Empty tree", detail: "There is no path to score.", activeLines: [17], activeId: null, leftGain: null, rightGain: null, throughSum: null, result: 0 });
    return { frames };
  }

  dfs(root);
  push({ kind: "done", phase: "done", title: `Maximum path sum = ${maxSum}`, detail: `The best path is ${bestPath.map((node) => node.value).join(" -> ")}.`, activeLines: [17], activeId: null, leftGain: null, rightGain: null, throughSum: maxSum, result: maxSum });
  return { frames };

  function dfs(node: TreeNode | null): Gain {
    if (!node) return { gain: 0, chain: [] };
    stack.push(`dfs(${node.value})`);
    push({ kind: "visit", phase: "enter", title: `Visit ${node.value}`, detail: "First ask both children for their best downward contribution.", activeLines: [4, 5], activeId: node.id, leftGain: null, rightGain: null, throughSum: null, result: null });

    const leftResult = dfs(node.left);
    const leftGain = Math.max(leftResult.gain, 0);
    if (leftResult.gain < 0) {
      push({ kind: "prune", phase: "ignore", title: `Ignore negative left gain ${leftResult.gain}`, detail: "A negative branch would reduce every path through this node, so clamp it to 0.", activeLines: [9], activeId: node.id, leftGain, rightGain: null, throughSum: null, result: null });
    }

    const rightResult = dfs(node.right);
    const rightGain = Math.max(rightResult.gain, 0);
    if (rightResult.gain < 0) {
      push({ kind: "prune", phase: "ignore", title: `Ignore negative right gain ${rightResult.gain}`, detail: "A negative branch would reduce every path through this node, so clamp it to 0.", activeLines: [10], activeId: node.id, leftGain, rightGain, throughSum: null, result: null });
    }

    const throughSum = node.value + leftGain + rightGain;
    const throughPath = [
      ...(leftGain > 0 ? [...leftResult.chain].reverse() : []),
      node,
      ...(rightGain > 0 ? rightResult.chain : []),
    ];
    const improvesBest = throughSum > maxSum;
    if (improvesBest) {
      maxSum = throughSum;
      bestPath = throughPath;
    }
    push({ kind: improvesBest ? "found" : "visit", phase: "compare", title: improvesBest ? `New max path: ${throughSum}` : `Compare through ${node.value}: ${throughSum}`, detail: improvesBest ? `The path ${throughPath.map((item) => item.value).join(" -> ")} becomes the new global maximum.` : `max_sum remains ${maxSum}.`, activeLines: [11, 12], activeId: node.id, leftGain, rightGain, throughSum, result: null });

    const useLeft = leftGain >= rightGain;
    const chosenGain = useLeft ? leftGain : rightGain;
    const chosenChain = useLeft ? leftResult.chain : rightResult.chain;
    const gain = node.value + chosenGain;
    gains[node.id] = gain;
    push({ kind: "backtrack", phase: "gain", title: `Return gain ${gain} from ${node.value}`, detail: `Only one branch can continue upward: ${node.value}${chosenChain.length ? ` -> ${chosenChain.map((item) => item.value).join(" -> ")}` : ""}.`, activeLines: [13], activeId: node.id, leftGain, rightGain, throughSum, result: null });
    stack.pop();
    return { gain, chain: [node, ...(chosenGain > 0 ? chosenChain : [])] };
  }
}

function buildTree(values: Array<number | null>): TreeNode | null {
  if (typeof values[0] !== "number") return null;
  const root: TreeNode = { id: "node-0", value: values[0], left: null, right: null };
  const queue = [root];
  let cursor = 1;
  while (queue.length && cursor < values.length) {
    const node = queue.shift()!;
    const leftValue = values[cursor];
    const leftIndex = cursor;
    cursor += 1;
    if (typeof leftValue === "number") {
      node.left = { id: `node-${leftIndex}`, value: leftValue, left: null, right: null };
      queue.push(node.left);
    }
    if (cursor >= values.length) break;
    const rightValue = values[cursor];
    const rightIndex = cursor;
    cursor += 1;
    if (typeof rightValue === "number") {
      node.right = { id: `node-${rightIndex}`, value: rightValue, left: null, right: null };
      queue.push(node.right);
    }
  }
  return root;
}
