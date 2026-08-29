import type { FrameKind } from "../../shared/types";

type TreeNode = { id: string; value: number; left: TreeNode | null; right: TreeNode | null };

export type ValidateBstFrame = {
  kind: FrameKind;
  phase: "start" | "enter" | "left" | "right" | "invalid" | "valid" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  activeId: string | null;
  activeValue: number | null;
  visitedIds: string[];
  stack: string[];
  low: number | null;
  high: number | null;
  result: boolean | null;
};

export function createValidateBstDryRun(values: Array<number | null>): { frames: ValidateBstFrame[] } {
  const root = buildTree(values);
  const frames: ValidateBstFrame[] = [];
  const visitedIds = new Set<string>();
  const stack: string[] = [];
  const snapshot = (frame: Omit<ValidateBstFrame, "visitedIds" | "stack">) => frames.push({ ...frame, visitedIds: [...visitedIds], stack: [...stack] });

  snapshot({ kind: "start", phase: "start", title: "Start with no bounds", detail: "The root may be any value, so its valid interval is (-inf, +inf).", activeLines: [11], activeId: root?.id ?? null, activeValue: root?.value ?? null, low: null, high: null, result: null });
  const result = dfs(root, null, null);
  snapshot({ kind: "done", phase: "done", title: result ? "Every node stays in range" : "A node breaks its allowed range", detail: result ? "All recursive bounds were respected, so this is a valid BST." : "At least one value violates a bound inherited from an ancestor.", activeLines: [12], activeId: null, activeValue: null, low: null, high: null, result });
  return { frames };

  function dfs(node: TreeNode | null, low: number | null, high: number | null): boolean {
    if (!node) return true;
    stack.push(`valid(${node.value}, ${range(low, high)})`);
    snapshot({ kind: "visit", phase: "enter", title: `Check node ${node.value}`, detail: `${node.value} must be strictly inside ${range(low, high)}.`, activeLines: [5, 6], activeId: node.id, activeValue: node.value, low, high, result: null });
    if ((low !== null && node.value <= low) || (high !== null && node.value >= high)) {
      snapshot({ kind: "prune", phase: "invalid", title: `${node.value} is outside its range`, detail: `${node.value} is not in ${range(low, high)}, so this cannot be a BST.`, activeLines: [7, 8], activeId: node.id, activeValue: node.value, low, high, result: false });
      stack.pop();
      return false;
    }
    visitedIds.add(node.id);
    snapshot({ kind: "start", phase: "left", title: `Check left subtree of ${node.value}`, detail: `Every left descendant must stay below ${node.value}, so high becomes ${node.value}.`, activeLines: [10], activeId: node.left?.id ?? node.id, activeValue: node.left?.value ?? node.value, low, high: node.value, result: null });
    const leftValid = dfs(node.left, low, node.value);
    if (!leftValid) {
      stack.pop();
      return false;
    }
    snapshot({ kind: "start", phase: "right", title: `Check right subtree of ${node.value}`, detail: `Every right descendant must stay above ${node.value}, so low becomes ${node.value}.`, activeLines: [10], activeId: node.right?.id ?? node.id, activeValue: node.right?.value ?? node.value, low: node.value, high, result: null });
    const rightValid = dfs(node.right, node.value, high);
    const valid = leftValid && rightValid;
    snapshot({ kind: valid ? "found" : "backtrack", phase: "valid", title: valid ? `Node ${node.value} is valid` : `A subtree below ${node.value} failed`, detail: valid ? "Both subtrees satisfy their inherited bounds." : "Propagate the failed validation back to the caller.", activeLines: [10], activeId: node.id, activeValue: node.value, low, high, result: valid });
    stack.pop();
    return valid;
  }
}

function range(low: number | null, high: number | null): string { return `(${low ?? "-inf"}, ${high ?? "+inf"})`; }

function buildTree(values: Array<number | null>): TreeNode | null {
  if (typeof values[0] !== "number") return null;
  const root: TreeNode = { id: "node-0", value: values[0], left: null, right: null };
  const queue = [root]; let cursor = 1;
  while (queue.length && cursor < values.length) {
    const node = queue.shift()!;
    const left = values[cursor]; const leftId = cursor; cursor += 1;
    if (typeof left === "number") { node.left = { id: `node-${leftId}`, value: left, left: null, right: null }; queue.push(node.left); }
    if (cursor >= values.length) break;
    const right = values[cursor]; const rightId = cursor; cursor += 1;
    if (typeof right === "number") { node.right = { id: `node-${rightId}`, value: right, left: null, right: null }; queue.push(node.right); }
  }
  return root;
}
