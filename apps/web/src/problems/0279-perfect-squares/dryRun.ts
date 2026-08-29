import type { LinearDpFrame } from "../../shared/components/LinearDpVisualizer";

export type PerfectSquaresFrame = LinearDpFrame & { square: number | null; i: number | null };

export function createPerfectSquaresDryRun(n: number): { frames: PerfectSquaresFrame[] } {
  const frames: PerfectSquaresFrame[] = [];
  const dp = Array<number>(n + 1).fill(Number.POSITIVE_INFINITY);
  dp[0] = 0;
  const push = (frame: Omit<PerfectSquaresFrame, "dp">) => frames.push({ ...frame, dp: [...dp] });

  push({ kind: "start", title: "Initialize dp", detail: "dp[i] is the fewest perfect squares whose sum is i. Only dp[0] starts at 0.", activeLines: [3, 4], currentIndex: null, previousIndex: null, outerLabel: "square = -", innerLabel: "i = -", candidateLabel: null, result: null, square: null, i: null });

  for (let root = 1; root <= Math.floor(Math.sqrt(n)); root += 1) {
    const square = root * root;
    push({ kind: "build", title: `Square ${root} * ${root} = ${square}`, detail: "The submitted code reuses the loop variable after squaring it.", activeLines: [6, 7], currentIndex: null, previousIndex: null, outerLabel: `root = ${root}`, innerLabel: `square = ${square}`, candidateLabel: null, result: null, square, i: null });

    for (let i = square; i <= n; i += 1) {
      const before = dp[i];
      const candidate = dp[i - square] + 1;
      dp[i] = Math.min(before, candidate);
      const updated = dp[i] < before;
      push({ kind: updated ? "found" : "prune", title: updated ? `Update dp[${i}] to ${dp[i]}` : `Keep dp[${i}] at ${dp[i]}`, detail: `min(${formatNumber(before)}, dp[${i - square}] + 1 = ${formatNumber(candidate)}) = ${formatNumber(dp[i])}.`, activeLines: [8, 9], currentIndex: i, previousIndex: i - square, outerLabel: `square = ${square}`, innerLabel: `i = ${i}`, candidateLabel: `candidate = ${formatNumber(candidate)}`, result: null, square, i });
    }
  }

  push({ kind: "done", title: `Return dp[${n}] = ${dp[n]}`, detail: "Every square has been allowed to contribute repeatedly, exactly as in the submitted implementation.", activeLines: [11], currentIndex: null, previousIndex: null, outerLabel: "all squares processed", innerLabel: "done", candidateLabel: null, result: dp[n], square: null, i: null });
  return { frames };
}

function formatNumber(value: number) {
  return value === Number.POSITIVE_INFINITY ? "inf" : String(value);
}
