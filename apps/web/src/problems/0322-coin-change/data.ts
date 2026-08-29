import type { LinearDpExample } from "../../shared/components/LinearDpVisualizer";

export type CoinChangeInput = { coins: number[]; amount: number };

export const title = "322. Coin Change";
export const examples: LinearDpExample<CoinChangeInput>[] = [
  { id: 1, label: "LeetCode 1", input: { coins: [1, 2, 5], amount: 11 }, output: 3 },
  { id: 2, label: "LeetCode 2", input: { coins: [2], amount: 3 }, output: -1 },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def coinChange(self, coins: List[int], amount: int) -> int:",
  "        dp = [float('inf')] * (amount + 1)",
  "",
  "        # 凑出金额 0，不需要任何硬币",
  "        dp[0] = 0",
  "",
  "        for cur_amount in range(1, amount + 1):",
  "            for coin in coins:",
  "                if cur_amount >= coin:",
  "                    dp[cur_amount] = min(",
  "                        dp[cur_amount], dp[cur_amount - coin] + 1",
  "                    )",
  "",
  "        return dp[amount] if dp[amount] != float('inf') else -1",
];
