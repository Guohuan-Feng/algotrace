export const title = "122. Best Time to Buy and Sell Stock II";
export const examples = [
  { id: 1, label: "LeetCode 1", input: [7, 1, 5, 3, 6, 4], output: 7 },
  { id: 2, label: "LeetCode 2", input: [1, 2, 3, 4, 5], output: 4 },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def maxProfit(self, prices: List[int]) -> int:",
  "        buy = float('-inf')",
  "        sell = 0",
  "        for price in prices:",
  "            buy = max(buy, sell - price)",
  "            sell = max(sell, buy + price)",
  "        return sell",
];
