export type SubarraySumInput = { nums: number[]; k: number };
export type SubarraySumExample = { id: number; label: string; input: SubarraySumInput; output: number };
export const title = "560. Subarray Sum Equals K";
export const examples: SubarraySumExample[] = [{ id: 1, label: "LeetCode 1", input: { nums: [1, 1, 1], k: 2 }, output: 2 }, { id: 2, label: "LeetCode 2", input: { nums: [1, 2, 3], k: 3 }, output: 2 }]; export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def subarraySum(self, nums: List[int], k: int) -> int:", "        prefix_count = {0: 1}", "        total = count = 0", "        for num in nums:", "            total += num", "            count += prefix_count.get(total - k, 0)", "            prefix_count[total] = prefix_count.get(total, 0) + 1", "        return count"];
