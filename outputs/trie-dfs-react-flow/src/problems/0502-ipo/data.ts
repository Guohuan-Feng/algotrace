export type IpoExample = {
  id: 1 | 2 | 3;
  label: string;
  k: number;
  w: number;
  profits: number[];
  capital: number[];
  output: number;
};

export const title = "502. IPO";

export const examples: IpoExample[] = [
  { id: 1, label: "LeetCode 1", k: 2, w: 0, profits: [1, 2, 3], capital: [0, 1, 1], output: 4 },
  { id: 2, label: "LeetCode 2", k: 3, w: 0, profits: [1, 2, 3], capital: [0, 1, 2], output: 6 },
  { id: 3, label: "Locked project", k: 2, w: 1, profits: [2, 4, 6, 8], capital: [1, 3, 5, 10], output: 7 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "import heapq",
  "from typing import List",
  "",
  "class Solution:",
  "    def findMaximizedCapital(",
  "        self,",
  "        k: int,",
  "        w: int,",
  "        profits: List[int],",
  "        capital: List[int]",
  "    ) -> int:",
  "        capital_heap = []",
  "        for c, p in zip(capital, profits):",
  "            heapq.heappush(capital_heap, (c, p))",
  "",
  "        profit_heap = []",
  "",
  "        for _ in range(k):",
  "            while capital_heap and capital_heap[0][0] <= w:",
  "                c, p = heapq.heappop(capital_heap)",
  "                heapq.heappush(profit_heap, -p)",
  "",
  "            if not profit_heap:",
  "                break",
  "",
  "            w += -heapq.heappop(profit_heap)",
  "",
  "        return w",
];
