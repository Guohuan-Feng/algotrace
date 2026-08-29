export type KthLargestStreamInput = { k: number; nums: number[]; adds: number[] };

export const title = "703. Kth Largest Element in a Stream";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { k: 3, nums: [4, 5, 8, 2], adds: [3, 5, 10, 9, 4] }, output: [4, 5, 5, 8, 8] },
] satisfies Array<{ id: number; label: string; input: KthLargestStreamInput; output: number[] }>;
export const defaultExample = examples[0]!;
export const codeLines = [
  "class KthLargest:",
  "    def __init__(self, k: int, nums: List[int]):",
  "        self.k = k",
  "        self.heap = nums",
  "        heapq.heapify(self.heap)",
  "        while len(self.heap) > k:",
  "            heapq.heappop(self.heap)",
  "    def add(self, val: int) -> int:",
  "        heapq.heappush(self.heap, val)",
  "        if len(self.heap) > self.k:",
  "            heapq.heappop(self.heap)",
  "        return self.heap[0]",
];
