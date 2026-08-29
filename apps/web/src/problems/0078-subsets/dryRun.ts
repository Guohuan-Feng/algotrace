import type { FrameKind } from "../../shared/types";

export type SubsetsFrame = { kind: FrameKind; title: string; detail: string; activeLines: number[]; nums: number[]; start: number; path: number[]; currentIndex: number | null; stack: string[]; results: number[][]; result: number[][] | null };

export function createSubsetsDryRun(nums: number[]): { frames: SubsetsFrame[] } {
  const results: number[][] = []; const stack: string[] = []; const frames: SubsetsFrame[] = [];
  const push = (frame: Omit<SubsetsFrame, "nums" | "stack" | "results">) => frames.push({ ...frame, nums: [...nums], stack: [...stack], results: results.map((item) => [...item]) });
  const backtrack = (start: number, path: number[]): void => {
    stack.push(`backtrack(${start}, [${path.join(", ")}])`); results.push([...path]);
    push({ kind: "found", title: `Append [${path.join(", ")}]`, detail: "Every current path is one subset, including the empty path.", activeLines: [5, 6], start, path, currentIndex: null, result: null });
    for (let i = start; i < nums.length; i += 1) { const nextPath = [...path, nums[i]!]; push({ kind: "build", title: `Choose nums[${i}] = ${nums[i]}`, detail: `Move start to ${i + 1} so later recursive calls only add later values.`, activeLines: [8, 9], start, path: nextPath, currentIndex: i, result: null }); backtrack(i + 1, nextPath); push({ kind: "backtrack", title: `Return after ${nums[i]}`, detail: "Resume the parent loop for its next candidate.", activeLines: [8], start, path, currentIndex: i, result: null }); }
    stack.pop();
  };
  push({ kind: "start", title: "Create res", detail: `Enumerate every subset of [${nums.join(", ")}].`, activeLines: [2, 3], start: 0, path: [], currentIndex: null, result: null });
  push({ kind: "start", title: "Call backtrack(0, [])", detail: "Start at index 0 with an empty path.", activeLines: [11], start: 0, path: [], currentIndex: null, result: null });
  backtrack(0, []);
  push({ kind: "done", title: `Return ${results.length} subsets`, detail: "All subsets are built in depth-first order.", activeLines: [13], start: nums.length, path: [], currentIndex: null, result: results.map((item) => [...item]) });
  return { frames };
}
