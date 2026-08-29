export type NetworkDelayInput = { times: number[][]; n: number; k: number };

export const title = "743. Network Delay Time";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { times: [[2, 1, 1], [2, 3, 1], [3, 4, 1]], n: 4, k: 2 }, output: 2 },
  { id: 2, label: "LeetCode 2", input: { times: [[1, 2, 1]], n: 2, k: 1 }, output: 1 },
] satisfies Array<{ id: number; label: string; input: NetworkDelayInput; output: number }>;
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:",
  "        graph = defaultdict(list)",
  "",
  "        for u, v, w in times:",
  "            graph[u].append((v, w))",
  "",
  "        dist = [float(\"inf\")] * (n + 1)",
  "        dist[k] = 0",
  "",
  "        heap = [(0, k)]",
  "",
  "        while heap:",
  "            cur_dist, node = heapq.heappop(heap)",
  "",
  "            if cur_dist > dist[node]:",
  "                continue",
  "",
  "            for nei, weight in graph[node]:",
  "                new_dist = cur_dist + weight",
  "",
  "                if new_dist < dist[nei]:",
  "                    dist[nei] = new_dist",
  "                    heapq.heappush(heap, (new_dist, nei))",
  "",
  "        ans = max(dist[1:])",
  "",
  "        if ans == float(\"inf\"):",
  "            return -1",
  "",
  "        return ans",
];
