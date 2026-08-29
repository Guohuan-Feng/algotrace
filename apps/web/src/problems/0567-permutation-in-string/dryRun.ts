import type { ArrayTraceFrame } from "../../shared/components/ArrayTraceVisualizer";

export type PermutationFrame = ArrayTraceFrame & { phase: "start" | "expand" | "shrink" | "check" | "found" | "done"; left: number; right: number; window: string; matches: boolean; needEntries: Array<[string, number]>; windowEntries: Array<[string, number]> };

export function createPermutationInStringDryRun(s1: string, s2: string): { frames: PermutationFrame[] } {
  const frames: PermutationFrame[] = [];
  const need = frequency(s1);
  const window = new Map<string, number>();
  let left = 0, right = -1;
  const push = (frame: Omit<PermutationFrame, "cells" | "activeIndices" | "completeIndices" | "left" | "right" | "window" | "matches" | "needEntries" | "windowEntries"> & { matches?: boolean }) => frames.push({ ...frame, cells: [...s2], activeIndices: right >= left ? Array.from({ length: right - left + 1 }, (_, index) => left + index) : [], completeIndices: Array.from({ length: left }, (_, index) => index), left, right, window: right >= left ? s2.slice(left, right + 1) : "", matches: frame.matches ?? same(window, need), needEntries: [...need.entries()], windowEntries: [...window.entries()] });
  push({ kind: "start", phase: "start", title: "Build the target frequency map", detail: `Every candidate window must contain exactly the letters in ${JSON.stringify(s1)}.`, activeLines: [3, 4, 5], result: null });
  for (right = 0; right < s2.length; right += 1) {
    add(window, s2[right]!, 1);
    push({ kind: "visit", phase: "expand", title: `Expand with ${JSON.stringify(s2[right])}`, detail: "Add the new right character to the sliding-window frequency map.", activeLines: [6, 7], result: null });
    if (right - left + 1 > s1.length) {
      add(window, s2[left]!, -1);
      push({ kind: "prune", phase: "shrink", title: `Remove ${JSON.stringify(s2[left])} from the left`, detail: "The window grew too large, so discard its oldest character.", activeLines: [8, 9], result: null });
      left += 1;
      push({ kind: "visit", phase: "shrink", title: `Advance left to ${left}`, detail: "The window is back to the target length.", activeLines: [10], result: null });
    }
    const matches = same(window, need);
    push({ kind: matches ? "found" : "visit", phase: matches ? "found" : "check", title: `Compare window ${JSON.stringify(s2.slice(left, right + 1))}`, detail: matches ? "The two frequency maps match, so this window is a permutation." : "The character frequencies differ, so slide to the next window.", activeLines: [11], result: matches ? true : null, matches });
    if (matches) return { frames };
  }
  push({ kind: "done", phase: "done", title: "No permutation window exists", detail: "Every window of the required length was checked.", activeLines: [13], result: false, matches: false });
  return { frames };
}

function frequency(text: string): Map<string, number> { const map = new Map<string, number>(); for (const char of text) add(map, char, 1); return map; }
function add(map: Map<string, number>, char: string, delta: number): void { const next = (map.get(char) ?? 0) + delta; if (next === 0) map.delete(char); else map.set(char, next); }
function same(left: Map<string, number>, right: Map<string, number>): boolean { return left.size === right.size && [...left].every(([key, value]) => right.get(key) === value); }
