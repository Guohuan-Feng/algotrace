export type MinimumSizeSubarraySumInput = { target: number; nums: number[] };
export const title = "209. Minimum Size Subarray Sum";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { target: 7, nums: [2, 3, 1, 2, 4, 3] }, output: 2 },
  { id: 2, label: "LeetCode 2", input: { target: 4, nums: [1, 4, 4] }, output: 1 },
  { id: 3, label: "LeetCode 3", input: { target: 11, nums: [1, 1, 1, 1, 1, 1, 1, 1] }, output: 0 },
] satisfies Array<{ id: number; label: string; input: MinimumSizeSubarraySumInput; output: number }>;
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def minSubArrayLen(self, target: int, nums: List[int]) -> int:", "        left = total = 0", "        ans = float('inf')", "", "        for right, num in enumerate(nums):", "            total += num", "            while total >= target:", "                ans = min(ans, right - left + 1)", "                total -= nums[left]", "                left += 1", "", "        return 0 if ans == float('inf') else ans"];
