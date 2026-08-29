import type { ArrayTraceFrame } from "../../shared/components/ArrayTraceVisualizer";

export type ValidPalindromeIIFrame = ArrayTraceFrame & { phase: "start" | "match" | "branch" | "check" | "done"; left: number; right: number; skipped: number | null; firstBranch: boolean | null; secondBranch: boolean | null };

export function createValidPalindromeIIDryRun(s: string): { frames: ValidPalindromeIIFrame[] } {
  const frames: ValidPalindromeIIFrame[] = [];
  let left = 0, right = s.length - 1;
  let skipped: number | null = null;
  let firstBranch: boolean | null = null;
  let secondBranch: boolean | null = null;
  const push = (frame: Omit<ValidPalindromeIIFrame, "cells" | "activeIndices" | "completeIndices" | "left" | "right" | "skipped" | "firstBranch" | "secondBranch">) => frames.push({ ...frame, cells: [...s], activeIndices: left < right ? [left, right] : left === right ? [left] : [], completeIndices: Array.from({ length: left }, (_, index) => index).concat(Array.from({ length: s.length - right - 1 }, (_, index) => s.length - index - 1)), left, right, skipped, firstBranch, secondBranch });
  push({ kind: "start", phase: "start", title: "Place pointers at both ends", detail: "Matching characters can be confirmed immediately; one mismatch may consume the single deletion.", activeLines: [10], result: null });
  while (left < right) {
    if (s[left] === s[right]) {
      push({ kind: "visit", phase: "match", title: `Match ${JSON.stringify(s[left])} at ${left} and ${right}`, detail: "Keep both characters and move inward.", activeLines: [11, 14, 15], result: null });
      left += 1;
      right -= 1;
      continue;
    }
    skipped = left;
    push({ kind: "prune", phase: "branch", title: `Mismatch ${JSON.stringify(s[left])} vs ${JSON.stringify(s[right])}`, detail: "Use the one allowed deletion to test both possible skips.", activeLines: [11, 12, 13], result: null });
    firstBranch = palindrome(s, left + 1, right);
    secondBranch = palindrome(s, left, right - 1);
    const answer = firstBranch || secondBranch;
    push({ kind: answer ? "found" : "prune", phase: "check", title: "Check the two deletion branches", detail: `Skip left: ${firstBranch}; skip right: ${secondBranch}.`, activeLines: [2, 3, 9, 13], result: answer });
    push({ kind: "done", phase: "done", title: answer ? "A one-character deletion works" : "Neither deletion makes a palindrome", detail: "The first mismatch completely determines the answer.", activeLines: [13], result: answer });
    return { frames };
  }
  push({ kind: "done", phase: "done", title: "All endpoint pairs matched", detail: "No deletion was needed.", activeLines: [16], result: true });
  return { frames };
}

function palindrome(s: string, left: number, right: number): boolean { while (left < right) { if (s[left] !== s[right]) return false; left += 1; right -= 1; } return true; }
