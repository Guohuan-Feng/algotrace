export type TopKFrequentInput = { nums: number[]; k: number };
export type TopKFrequentExample = { id: number; label: string; input: TopKFrequentInput; output: number[] };
export const title = "347. Top K Frequent Elements";
export const examples: TopKFrequentExample[] = [
  { id: 1, label: "LeetCode 1", input: { nums: [1, 1, 1, 2, 2, 3], k: 2 }, output: [1, 2] },
  { id: 2, label: "LeetCode 2", input: { nums: [1], k: 1 }, output: [1] },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def topKFrequent(self, nums: List[int], k: int) -> List[int]:",
  "        count = Counter(nums)",
  "        heap = []",
  "",
  "        for num, freq in count.items():",
  "            heapq.heappush(heap, (freq, num))",
  "            if len(heap) > k:",
  "                heapq.heappop(heap)",
  "",
  "        return [num for freq, num in heap]",
];
