import type { LinearDpFrame } from "../../shared/components/LinearDpVisualizer";

export type WordBreakFrame = LinearDpFrame & { i: number | null; j: number | null; candidate: string | null };

export function createWordBreakDryRun(s: string, dictionary: string[]): { frames: WordBreakFrame[] } {
  const frames: WordBreakFrame[] = [];
  const wordSet = new Set(dictionary);
  const dp = Array<boolean>(s.length + 1).fill(false);
  dp[0] = true;
  const push = (frame: Omit<WordBreakFrame, "dp">) => frames.push({ ...frame, dp: [...dp] });

  push({ kind: "start", title: "Seed the empty prefix", detail: "dp[i] means the first i characters can be segmented. The empty prefix is valid.", activeLines: [3, 5, 6, 8], currentIndex: 0, previousIndex: null, outerLabel: "i = -", innerLabel: "j = -", candidateLabel: null, result: null, i: null, j: null, candidate: null });
  for (let i = 1; i <= s.length; i += 1) {
    push({ kind: "visit", title: `Try prefix s[:${i}]`, detail: "The outer loop asks whether the first i characters can be split into dictionary words.", activeLines: [10], currentIndex: i, previousIndex: null, outerLabel: `i = ${i}`, innerLabel: "choose j", candidateLabel: null, result: null, i, j: null, candidate: null });
    for (let j = 0; j < i; j += 1) {
      const candidate = s.slice(j, i);
      const matches = dp[j] && wordSet.has(candidate);
      push({ kind: matches ? "found" : "prune", title: matches ? `Match "${candidate}" after prefix ${j}` : `Try "${candidate}"`, detail: matches ? `dp[${j}] is true and "${candidate}" is in wordSet, so s[:${i}] is valid.` : `Need both dp[${j}] and a dictionary match; this split does not satisfy both.`, activeLines: [11, 12], currentIndex: i, previousIndex: j, outerLabel: `i = ${i}`, innerLabel: `j = ${j}`, candidateLabel: `s[${j}:${i}] = "${candidate}"`, result: null, i, j, candidate });
      if (matches) {
        dp[i] = true;
        push({ kind: "found", title: `Set dp[${i}] = True and break`, detail: "The submitted code stops checking earlier splits as soon as one valid final word is found.", activeLines: [12, 13, 14], currentIndex: i, previousIndex: j, outerLabel: `i = ${i}`, innerLabel: `j = ${j}`, candidateLabel: `word = "${candidate}"`, result: null, i, j, candidate });
        break;
      }
    }
  }
  push({ kind: "done", title: `Return dp[${s.length}] = ${dp[s.length]}`, detail: "The complete string is segmentable exactly when its final prefix state is true.", activeLines: [16], currentIndex: s.length, previousIndex: null, outerLabel: "all prefixes processed", innerLabel: "done", candidateLabel: null, result: dp[s.length], i: null, j: null, candidate: null });
  return { frames };
}
