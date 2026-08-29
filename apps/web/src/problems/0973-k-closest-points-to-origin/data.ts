export type KClosestInput = { points: number[][]; k: number };

export const title = "973. K Closest Points to Origin";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { points: [[1, 3], [-2, 2]], k: 1 }, output: [[-2, 2]] },
  { id: 2, label: "LeetCode 2", input: { points: [[3, 3], [5, -1], [-2, 4]], k: 2 }, output: [[3, 3], [-2, 4]] },
] satisfies Array<{ id: number; label: string; input: KClosestInput; output: number[][] }>;
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:",
  "        heap = []",
  "        for x, y in points:",
  "            distance = x * x + y * y",
  "            heapq.heappush(heap, (-distance, x, y))",
  "            if len(heap) > k:",
  "                heapq.heappop(heap)",
  "        return [[x, y] for _, x, y in heap]",
];
