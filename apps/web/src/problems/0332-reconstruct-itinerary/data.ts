export type ItineraryExample = {
  id: 1 | 2;
  label: string;
  tickets: string[][];
  output: string[];
};

export const title = "332. Reconstruct Itinerary";

export const examples: ItineraryExample[] = [
  {
    id: 1,
    label: "LeetCode 1",
    tickets: [["MUC", "LHR"], ["JFK", "MUC"], ["SFO", "SJC"], ["LHR", "SFO"]],
    output: ["JFK", "MUC", "LHR", "SFO", "SJC"],
  },
  {
    id: 2,
    label: "LeetCode 2",
    tickets: [["JFK", "SFO"], ["JFK", "ATL"], ["SFO", "ATL"], ["ATL", "JFK"], ["ATL", "SFO"]],
    output: ["JFK", "ATL", "JFK", "SFO", "ATL", "SFO"],
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "from collections import defaultdict",
  "import heapq",
  "",
  "",
  "class Solution:",
  "    def findItinerary(self, tickets: List[List[str]]) -> List[str]:",
  "        graph = defaultdict(list)",
  "",
  "        # 建图，用最小堆保证字典序最小",
  "        for a, b in tickets:",
  "            heapq.heappush(graph[a], b)",
  "",
  "        res = []",
  "",
  "        def dfs(airport):",
  "            # 一直走，直到当前机场没有下一站",
  "            while graph[airport]:",
  "                next_airport = heapq.heappop(graph[airport])",
  "                dfs(next_airport)",
  "",
  "            # 注意：是走不动之后再加入答案",
  "            res.append(airport)",
  "",
  "        dfs(\"JFK\")",
  "",
  "        return res[::-1]",
];
