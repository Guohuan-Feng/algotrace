import type { LinearDpFrame } from "../../shared/components/LinearDpVisualizer";

export type TribonacciFrame = LinearDpFrame & { n: number; i: number | null };

export function createTribonacciDryRun(n: number): { frames: TribonacciFrame[] } {
  const frames: TribonacciFrame[] = [];
  const dp = Array<number>(n + 1).fill(0);
  const push = (frame: Omit<TribonacciFrame, "dp">) => frames.push({ ...frame, dp: [...dp] });

  if (n === 0) {
    push({ kind: "done", title: "Return 0", detail: "The first guard handles n = 0 before allocating or filling a DP array.", activeLines: [3, 4], currentIndex: 0, previousIndex: null, outerLabel: "n = 0", innerLabel: "base case", candidateLabel: null, result: 0, n, i: 0 });
    return { frames };
  }
  if (n === 1 || n === 2) {
    dp[n] = 1;
    push({ kind: "done", title: "Return 1", detail: "The second guard handles both n = 1 and n = 2.", activeLines: [5, 6], currentIndex: n, previousIndex: null, outerLabel: `n = ${n}`, innerLabel: "base case", candidateLabel: null, result: 1, n, i: n });
    return { frames };
  }

  dp[0] = 0;
  dp[1] = 1;
  dp[2] = 1;
  push({ kind: "start", title: "Set the three base states", detail: "Each later value is the sum of these three preceding positions.", activeLines: [8, 10, 11, 12], currentIndex: 2, previousIndex: 1, outerLabel: "i = -", innerLabel: "base states", candidateLabel: "dp = [0, 1, 1]", result: null, n, i: null });

  for (let i = 3; i <= n; i += 1) {
    dp[i] = dp[i - 1]! + dp[i - 2]! + dp[i - 3]!;
    push({ kind: "found", title: `Set dp[${i}] = ${dp[i]}`, detail: `dp[${i - 1}] + dp[${i - 2}] + dp[${i - 3}] = ${dp[i]}.`, activeLines: [14, 15], currentIndex: i, previousIndex: i - 1, outerLabel: `i = ${i}`, innerLabel: `sources = ${i - 1}, ${i - 2}, ${i - 3}`, candidateLabel: `sum = ${dp[i]}`, result: null, n, i });
  }

  push({ kind: "done", title: `Return dp[${n}] = ${dp[n]}`, detail: "The final array entry is the requested Tribonacci number.", activeLines: [17], currentIndex: null, previousIndex: null, outerLabel: "all indices processed", innerLabel: "done", candidateLabel: null, result: dp[n]!, n, i: null });
  return { frames };
}
