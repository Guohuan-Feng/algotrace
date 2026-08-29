import type { FrameKind } from "../../shared/types";
type T = { id: string; value: number; left: T | null; right: T | null };
export type SameTreeFrame = { kind: FrameKind; phase: "start" | "compare" | "left" | "right" | "mismatch" | "match" | "done"; title: string; detail: string; activeLines: number[]; pId: string | null; qId: string | null; stack: string[]; result: boolean | null };
export function createSameTreeDryRun(pValues: Array<number | null>, qValues: Array<number | null>): { frames: SameTreeFrame[] } {
  const frames: SameTreeFrame[] = []; const stack: string[] = []; const pRoot = build(pValues); const qRoot = build(qValues); const push = (frame: Omit<SameTreeFrame, "stack">) => frames.push({ ...frame, stack: [...stack] });
  push({ kind: "start", phase: "start", title: "Compare both roots", detail: "Two trees match only when every corresponding node and child position agrees.", activeLines: [11], pId: pRoot?.id ?? null, qId: qRoot?.id ?? null, result: null });
  const result = same(pRoot, qRoot);
  push({ kind: "done", phase: "done", title: result ? "The trees are the same" : "The trees differ", detail: result ? "All paired recursive calls matched." : "A paired call found different structure or values.", activeLines: [12], pId: null, qId: null, result });
  return { frames };
  function same(p: T | null, q: T | null): boolean {
    stack.push(`same(${p?.value ?? "None"}, ${q?.value ?? "None"})`);
    push({ kind: "visit", phase: "compare", title: `Compare ${p?.value ?? "None"} and ${q?.value ?? "None"}`, detail: "Check their existence and value before comparing children.", activeLines: [5], pId: p?.id ?? null, qId: q?.id ?? null, result: null });
    if (!p && !q) { push({ kind: "found", phase: "match", title: "Both positions are empty", detail: "Two empty child positions match.", activeLines: [6, 7], pId: null, qId: null, result: true }); stack.pop(); return true; }
    if (!p || !q || p.value !== q.value) { push({ kind: "prune", phase: "mismatch", title: "This pair does not match", detail: !p || !q ? "One position has a node and the other is empty." : `${p.value} and ${q.value} are different values.`, activeLines: [8, 9], pId: p?.id ?? null, qId: q?.id ?? null, result: false }); stack.pop(); return false; }
    push({ kind: "start", phase: "left", title: `Compare left children of ${p.value}`, detail: "Both left positions must match first.", activeLines: [11], pId: p.left?.id ?? null, qId: q.left?.id ?? null, result: null }); const left = same(p.left, q.left); if (!left) { stack.pop(); return false; }
    push({ kind: "start", phase: "right", title: `Compare right children of ${p.value}`, detail: "Then both right positions must match.", activeLines: [11], pId: p.right?.id ?? null, qId: q.right?.id ?? null, result: null }); const right = same(p.right, q.right); stack.pop(); return right;
  }
}
function build(values: Array<number | null>): T | null { if (typeof values[0] !== "number") return null; const root: T = { id: "node-0", value: values[0], left: null, right: null }; const queue = [root]; let i = 1; while (queue.length && i < values.length) { const n = queue.shift()!; const l = values[i]; const li = i; i += 1; if (typeof l === "number") { n.left = { id: `node-${li}`, value: l, left: null, right: null }; queue.push(n.left); } if (i >= values.length) break; const r = values[i]; const ri = i; i += 1; if (typeof r === "number") { n.right = { id: `node-${ri}`, value: r, left: null, right: null }; queue.push(n.right); } } return root; }
