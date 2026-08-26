export type CheapestFlightExample = {
  id: 1 | 2 | 3;
  label: string;
  n: number;
  flights: number[][];
  src: number;
  dst: number;
  k: number;
  output: number;
};

export const title = "787. Cheapest Flights Within K Stops";

const sharedFlights = [
  [0, 1, 100],
  [1, 2, 100],
  [2, 0, 100],
  [1, 3, 600],
  [2, 3, 200],
];

export const examples: CheapestFlightExample[] = [
  { id: 1, label: "LeetCode 1", n: 4, flights: sharedFlights, src: 0, dst: 3, k: 1, output: 700 },
  { id: 2, label: "LeetCode 2", n: 4, flights: sharedFlights, src: 0, dst: 3, k: 2, output: 400 },
  { id: 3, label: "LeetCode 3", n: 3, flights: [[0, 1, 100], [1, 2, 100], [0, 2, 500]], src: 0, dst: 2, k: 1, output: 200 },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "",
  "class Solution:",
  "    def findCheapestPrice(",
  "        self,",
  "        n: int,",
  "        flights: List[List[int]],",
  "        src: int,",
  "        dst: int,",
  "        k: int",
  "    ) -> int:",
  "",
  "        # dist[i] = 从 src 到 i 的最小价格",
  "        dist = [float(\"inf\")] * n",
  "        dist[src] = 0",
  "",
  "        # 最多 k 个 stop = 最多经过 k + 1 条边",
  "        for _ in range(k + 1):",
  "            temp = dist.copy()",
  "",
  "            for u, v, price in flights:",
  "                if dist[u] != float(\"inf\"):",
  "                    temp[v] = min(temp[v], dist[u] + price)",
  "",
  "            dist = temp",
  "",
  "        return -1 if dist[dst] == float(\"inf\") else dist[dst]",
];
