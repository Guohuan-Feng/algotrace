export const title = "121. Best Time to Buy and Sell Stock";
export const examples = [
  { id: 1, label: "LeetCode 1", input: [7, 1, 5, 3, 6, 4], output: 5 },
  { id: 2, label: "LeetCode 2", input: [7, 6, 4, 3, 1], output: 0 },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def maxProfit(self, prices: List[int]) -> int:",
  "        buy = float('-inf')",
  "        sell = 0",
  "        for price in prices:",
  "            buy = max(buy, -price)",
  "            sell = max(sell, buy + price)",
  "        return sell",
];
