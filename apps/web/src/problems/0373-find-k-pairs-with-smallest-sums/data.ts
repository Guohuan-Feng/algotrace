export type KSmallestPairsInput = { nums1: number[]; nums2: number[]; k: number };
export type KSmallestPairsExample = { id: number; label: string; input: KSmallestPairsInput; output: number[][] };
export const title = "373. Find K Pairs with Smallest Sums";
export const examples: KSmallestPairsExample[] = [
  { id: 1, label: "LeetCode 1", input: { nums1: [1, 7, 11], nums2: [2, 4, 6], k: 3 }, output: [[1, 2], [1, 4], [1, 6]] },
  { id: 2, label: "LeetCode 2", input: { nums1: [1, 1, 2], nums2: [1, 2, 3], k: 2 }, output: [[1, 1], [1, 1]] },
];
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def kSmallestPairs(self, nums1, nums2, k):", "        heap = []", "        for i in range(min(k, len(nums1))):", "            heapq.heappush(heap, (nums1[i] + nums2[0], i, 0))", "", "        result = []", "        while heap and len(result) < k:", "            _, i, j = heapq.heappop(heap)", "            result.append([nums1[i], nums2[j]])", "            if j + 1 < len(nums2):", "                heapq.heappush(heap, (nums1[i] + nums2[j + 1], i, j + 1))", "", "        return result"];
