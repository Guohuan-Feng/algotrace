import type { LinearDpFrame } from "../../shared/components/LinearDpVisualizer";

export type CoinChangeFrame = LinearDpFrame & { amount: number; coin: number | null };

export function createCoinChangeDryRun(coins: number[], amount: number): { frames: CoinChangeFrame[] } {
  const frames: CoinChangeFrame[] = [];
  const dp = Array<number>(amount + 1).fill(Number.POSITIVE_INFINITY);
  dp[0] = 0;
  const push = (frame: Omit<CoinChangeFrame, "dp">) => frames.push({ ...frame, dp: [...dp] });

  push({ kind: "start", title: "Initialize unreachable amounts", detail: "Every amount begins at infinity, except amount 0 which needs zero coins.", activeLines: [5, 8], currentIndex: 0, previousIndex: null, outerLabel: "cur_amount = -", innerLabel: "coin = -", candidateLabel: null, result: null, amount: 0, coin: null });

  for (let curAmount = 1; curAmount <= amount; curAmount += 1) {
    push({ kind: "visit", title: `Try to make amount ${curAmount}`, detail: "The submitted code fixes the amount first, then tries every coin.", activeLines: [10], currentIndex: curAmount, previousIndex: null, outerLabel: `cur_amount = ${curAmount}`, innerLabel: "coin = -", candidateLabel: null, result: null, amount: curAmount, coin: null });
    for (const coin of coins) {
      if (curAmount < coin) {
        push({ kind: "prune", title: `${coin} is larger than ${curAmount}`, detail: "The guard cur_amount >= coin is false, so this transition is skipped.", activeLines: [11], currentIndex: curAmount, previousIndex: null, outerLabel: `cur_amount = ${curAmount}`, innerLabel: `coin = ${coin}`, candidateLabel: null, result: null, amount: curAmount, coin });
        continue;
      }
      const before = dp[curAmount]!;
      const candidate = dp[curAmount - coin]! + 1;
      dp[curAmount] = Math.min(before, candidate);
      const updated = dp[curAmount]! < before;
      push({ kind: updated ? "found" : "visit", title: updated ? `Update dp[${curAmount}] to ${dp[curAmount]}` : `Keep dp[${curAmount}] at ${formatValue(dp[curAmount]!)}`, detail: `min(${formatValue(before)}, dp[${curAmount - coin}] + 1 = ${formatValue(candidate)}) = ${formatValue(dp[curAmount]!)}`, activeLines: [12, 13, 14], currentIndex: curAmount, previousIndex: curAmount - coin, outerLabel: `cur_amount = ${curAmount}`, innerLabel: `coin = ${coin}`, candidateLabel: `candidate = ${formatValue(candidate)}`, result: null, amount: curAmount, coin });
    }
  }

  const result = dp[amount] === Number.POSITIVE_INFINITY ? -1 : dp[amount]!;
  push({ kind: "done", title: `Return ${result}`, detail: result === -1 ? "The target amount is still infinity, so the code returns -1." : `dp[${amount}] is the fewest coins needed for the target.`, activeLines: [17], currentIndex: null, previousIndex: null, outerLabel: "all amounts processed", innerLabel: "done", candidateLabel: null, result, amount, coin: null });
  return { frames };
}

function formatValue(value: number) {
  return value === Number.POSITIVE_INFINITY ? "inf" : String(value);
}
