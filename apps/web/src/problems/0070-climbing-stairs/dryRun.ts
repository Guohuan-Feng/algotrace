import type { LinearDpFrame } from "../../shared/components/LinearDpVisualizer";

export type ClimbingStairsFrame = LinearDpFrame & { n: number; i: number | null };

export function createClimbingStairsDryRun(n: number): { frames: ClimbingStairsFrame[] } {
  const frames: ClimbingStairsFrame[] = [];
  const dp = Array<number>(n + 1).fill(0);
  const push = (frame: Omit<ClimbingStairsFrame, "dp">) => frames.push({ ...frame, dp: [...dp] });

  if (n === 1) {
    dp[1] = 1;
    push({ kind: "done", title: "Return 1", detail: "The submitted guard returns immediately for one stair.", activeLines: [3, 4], currentIndex: 1, previousIndex: null, outerLabel: "n = 1", innerLabel: "base case", candidateLabel: null, result: 1, n, i: 1 });
    return { frames };
  }

  dp[1] = 1;
  dp[2] = 2;
  push({ kind: "start", title: "Set dp[1] = 1 and dp[2] = 2", detail: "There is one way to climb one stair and two ways to climb two stairs.", activeLines: [6, 8, 9], currentIndex: 2, previousIndex: 1, outerLabel: "i = -", innerLabel: "base states", candidateLabel: "dp[1] = 1, dp[2] = 2", result: null, n, i: null });

  for (let i = 3; i <= n; i += 1) {
    dp[i] = dp[i - 1]! + dp[i - 2]!;
    push({ kind: "found", title: `Set dp[${i}] = ${dp[i]}`, detail: `dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}.`, activeLines: [11, 12], currentIndex: i, previousIndex: i - 1, outerLabel: `i = ${i}`, innerLabel: `other source = dp[${i - 2}]`, candidateLabel: `sum = ${dp[i]}`, result: null, n, i });
  }

  push({ kind: "done", title: `Return dp[${n}] = ${dp[n]}`, detail: "The final entry stores every valid sequence of one- and two-step moves.", activeLines: [14], currentIndex: null, previousIndex: null, outerLabel: "all stairs processed", innerLabel: "done", candidateLabel: null, result: dp[n]!, n, i: null });
  return { frames };
}
