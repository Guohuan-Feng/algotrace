import type { FrameKind } from "../../shared/types";

export type SubsetsIiFrame = { kind: FrameKind; title: string; detail: string; activeLines: number[]; nums: number[]; start: number; path: number[]; currentIndex: number | null; skippedIndex: number | null; stack: string[]; results: number[][]; result: number[][] | null };

export function createSubsetsIiDryRun(numsInput: number[]): { frames: SubsetsIiFrame[] } {
  const nums = [...numsInput].sort((a, b) => a - b); const results: number[][] = []; const stack: string[] = []; const frames: SubsetsIiFrame[] = [];
  const push = (frame: Omit<SubsetsIiFrame, "nums" | "stack" | "results">) => frames.push({ ...frame, nums: [...nums], stack: [...stack], results: results.map((item) => [...item]) });
  const backtrack = (start: number, path: number[]): void => {
    stack.push(`backtrack(${start}, [${path.join(", ")}])`);
    results.push([...path]);
    push({ kind: "found", title: `Append [${path.join(", ")}]`, detail: "Every current path is a valid subset, so append it before extending the path.", activeLines: [6, 7], start, path, currentIndex: null, skippedIndex: null, result: null });
    for (let i = start; i < nums.length; i += 1) {
      push({ kind: "visit", title: `Try nums[${i}] = ${nums[i]}`, detail: "Only consider indices at or after start, so each subset stays in sorted order.", activeLines: [9, 10], start, path, currentIndex: i, skippedIndex: null, result: null });
      if (i > start && nums[i] === nums[i - 1]) { push({ kind: "prune", title: `Skip duplicate ${nums[i]}`, detail: "The same value was already tried at this recursion depth; this branch would repeat a subset.", activeLines: [10, 11], start, path, currentIndex: i, skippedIndex: i, result: null }); continue; }
      const nextPath = [...path, nums[i]!];
      push({ kind: "build", title: `Choose ${nums[i]}`, detail: `Call backtrack(${i + 1}, path + [${nums[i]}]) so this position cannot be reused.`, activeLines: [13], start, path: nextPath, currentIndex: i, skippedIndex: null, result: null });
      backtrack(i + 1, nextPath);
      push({ kind: "backtrack", title: `Return after ${nums[i]}`, detail: "The copied path leaves the parent subset unchanged for its next candidate.", activeLines: [9], start, path, currentIndex: i, skippedIndex: null, result: null });
    }
    stack.pop();
  };
  push({ kind: "start", title: "Sort nums", detail: `Sort to [${nums.join(", ")}] so equal values become adjacent for the duplicate guard.`, activeLines: [2, 3, 4], start: 0, path: [], currentIndex: null, skippedIndex: null, result: null });
  push({ kind: "start", title: "Call backtrack(0, [])", detail: "Start with the empty subset.", activeLines: [15], start: 0, path: [], currentIndex: null, skippedIndex: null, result: null });
  backtrack(0, []);
  push({ kind: "done", title: `Return ${results.length} subsets`, detail: "Each unique sorted subset was recorded exactly once.", activeLines: [17], start: nums.length, path: [], currentIndex: null, skippedIndex: null, result: results.map((item) => [...item]) });
  return { frames };
}
