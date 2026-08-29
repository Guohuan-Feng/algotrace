export type KthLargestInput = { nums: number[]; k: number };

export const title = "215. Kth Largest Element in an Array";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { nums: [3, 2, 1, 5, 6, 4], k: 2 }, output: 5 },
  { id: 2, label: "LeetCode 2", input: { nums: [3, 2, 3, 1, 2, 4, 5, 5, 6], k: 4 }, output: 4 },
] satisfies Array<{ id: number; label: string; input: KthLargestInput; output: number }>;
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def findKthLargest(self, nums: List[int], k: int) -> int:",
  "        heap = []",
  "        for num in nums:",
  "            heapq.heappush(heap, num)",
  "            if len(heap) > k:",
  "                heapq.heappop(heap)",
  "        return heap[0]",
];
