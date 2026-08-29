import type { FrameKind } from "../../shared/types";

export type CombinationSumIiFrame = { kind: FrameKind; title: string; detail: string; activeLines: number[]; candidates: number[]; target: number; start: number; total: number; path: number[]; currentIndex: number | null; skippedIndex: number | null; stack: string[]; results: number[][]; result: number[][] | null };

export function createCombinationSumIiDryRun(candidatesInput: number[], target: number): { frames: CombinationSumIiFrame[] } {
  const candidates = [...candidatesInput].sort((a, b) => a - b); const results: number[][] = []; const stack: string[] = []; const frames: CombinationSumIiFrame[] = [];
  const push = (frame: Omit<CombinationSumIiFrame, "candidates" | "target" | "stack" | "results">) => frames.push({ ...frame, candidates: [...candidates], target, stack: [...stack], results: results.map((item) => [...item]) });
  const backtrack = (start: number, path: number[], total: number): void => {
    stack.push(`backtrack(${start}, [${path.join(", ")}], ${total})`);
    push({ kind: "visit", title: `backtrack(total = ${total})`, detail: "First compare the running total with target before selecting another candidate.", activeLines: [6, 7, 11], start, path, total, currentIndex: null, skippedIndex: null, result: null });
    if (total === target) { results.push([...path]); push({ kind: "found", title: `Append [${path.join(", ")}]`, detail: "The path sums exactly to target, so record it and return.", activeLines: [7, 8, 9], start, path, total, currentIndex: null, skippedIndex: null, result: null }); stack.pop(); return; }
    if (total > target) { push({ kind: "prune", title: `Prune total ${total}`, detail: "The total exceeds target; all future candidates are positive, so this branch cannot recover.", activeLines: [11, 12], start, path, total, currentIndex: null, skippedIndex: null, result: null }); stack.pop(); return; }
    for (let i = start; i < candidates.length; i += 1) {
      push({ kind: "visit", title: `Try candidates[${i}] = ${candidates[i]}`, detail: "Use later indices only, ensuring each physical candidate is used at most once.", activeLines: [14, 15], start, path, total, currentIndex: i, skippedIndex: null, result: null });
      if (i > start && candidates[i] === candidates[i - 1]) { push({ kind: "prune", title: `Skip duplicate ${candidates[i]}`, detail: "This duplicate was already used for a sibling branch at the same depth.", activeLines: [15, 16], start, path, total, currentIndex: i, skippedIndex: i, result: null }); continue; }
      const nextPath = [...path, candidates[i]!]; const nextTotal = total + candidates[i]!;
      push({ kind: "build", title: `Choose ${candidates[i]}`, detail: `Recurse with index ${i + 1} and total ${nextTotal}.`, activeLines: [18], start, path: nextPath, total: nextTotal, currentIndex: i, skippedIndex: null, result: null });
      backtrack(i + 1, nextPath, nextTotal);
      push({ kind: "backtrack", title: `Return after ${candidates[i]}`, detail: "Continue testing the remaining candidates from the parent call.", activeLines: [14], start, path, total, currentIndex: i, skippedIndex: null, result: null });
    }
    stack.pop();
  };
  push({ kind: "start", title: "Sort candidates", detail: `Sort to [${candidates.join(", ")}] so equal candidates can be skipped at the same depth.`, activeLines: [2, 3, 4], start: 0, path: [], total: 0, currentIndex: null, skippedIndex: null, result: null });
  push({ kind: "start", title: "Call backtrack(0, [], 0)", detail: `Search for paths with sum ${target}.`, activeLines: [20], start: 0, path: [], total: 0, currentIndex: null, skippedIndex: null, result: null });
  backtrack(0, [], 0);
  push({ kind: "done", title: `Return ${results.length} combinations`, detail: "Every target-sum path uses distinct input indices and no duplicate sibling branches.", activeLines: [22], start: candidates.length, path: [], total: 0, currentIndex: null, skippedIndex: null, result: results.map((item) => [...item]) });
  return { frames };
}
