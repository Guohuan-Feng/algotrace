import type { FrameKind } from "../../shared/types";

export type PermutationsIiFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  nums: number[];
  used: boolean[];
  path: number[];
  currentIndex: number | null;
  skippedIndex: number | null;
  stack: string[];
  results: number[][];
  result: number[][] | null;
};

export function createPermutationsIiDryRun(numsInput: number[]): { frames: PermutationsIiFrame[] } {
  const nums = [...numsInput].sort((a, b) => a - b);
  const used = Array.from({ length: nums.length }, () => false);
  const results: number[][] = [];
  const frames: PermutationsIiFrame[] = [];
  const stack: string[] = [];
  const push = (frame: Omit<PermutationsIiFrame, "nums" | "used" | "stack" | "results">) => frames.push({ ...frame, nums: [...nums], used: [...used], stack: [...stack], results: results.map((entry) => [...entry]) });
  const backtrack = (path: number[]): void => {
    stack.push(`backtrack([${path.join(", ")}])`);
    push({ kind: "visit", title: `backtrack([${path.join(", ")}])`, detail: `A complete permutation needs ${nums.length} values.`, activeLines: [7, 8], path, currentIndex: null, skippedIndex: null, result: null });
    if (path.length === nums.length) {
      results.push([...path]);
      push({ kind: "found", title: `Append [${path.join(", ")}]`, detail: "All sorted positions have one chosen value, so record this unique permutation.", activeLines: [8, 9, 10], path, currentIndex: null, skippedIndex: null, result: null });
      stack.pop();
      return;
    }
    for (let i = 0; i < nums.length; i += 1) {
      push({ kind: "visit", title: `Try nums[${i}] = ${nums[i]}`, detail: "First skip positions already used by the current path.", activeLines: [12, 13], path, currentIndex: i, skippedIndex: null, result: null });
      if (used[i]) {
        push({ kind: "prune", title: `Skip used index ${i}`, detail: "This exact array position is already present in the path.", activeLines: [13, 14], path, currentIndex: i, skippedIndex: i, result: null });
        continue;
      }
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
        push({ kind: "prune", title: `Skip duplicate ${nums[i]} at index ${i}`, detail: "The equal value at index i - 1 was not chosen in this layer, so choosing this copy would duplicate a branch.", activeLines: [16, 17], path, currentIndex: i, skippedIndex: i, result: null });
        continue;
      }
      used[i] = true;
      const nextPath = [...path, nums[i]!];
      push({ kind: "build", title: `Choose nums[${i}] = ${nums[i]}`, detail: "Mark this sorted position used, then recurse with a copied path.", activeLines: [19, 20], path: nextPath, currentIndex: i, skippedIndex: null, result: null });
      backtrack(nextPath);
      used[i] = false;
      push({ kind: "backtrack", title: `Unmark index ${i}`, detail: "Restore used[i] so the parent call can try another position.", activeLines: [21], path, currentIndex: i, skippedIndex: null, result: null });
    }
    stack.pop();
  };
  push({ kind: "start", title: "Sort nums and create used", detail: `Sort to [${nums.join(", ")}] so adjacent duplicates can be skipped by the previous-index rule.`, activeLines: [2, 3, 4, 5], path: [], currentIndex: null, skippedIndex: null, result: null });
  push({ kind: "start", title: "Call backtrack([])", detail: "Start the unique-permutation DFS with no selected positions.", activeLines: [23], path: [], currentIndex: null, skippedIndex: null, result: null });
  backtrack([]);
  push({ kind: "done", title: `Return ${results.length} permutations`, detail: "The duplicate guard prevented equivalent branches from being explored.", activeLines: [25], path: [], currentIndex: null, skippedIndex: null, result: results.map((entry) => [...entry]) });
  return { frames };
}
