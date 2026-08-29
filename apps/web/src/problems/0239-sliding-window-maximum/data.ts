export type SlidingWindowMaximumInput = { nums: number[]; k: number };

export const title = "239. Sliding Window Maximum";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 }, output: [3, 3, 5, 5, 6, 7] },
  { id: 2, label: "LeetCode 2", input: { nums: [1], k: 1 }, output: [1] },
] satisfies Array<{ id: number; label: string; input: SlidingWindowMaximumInput; output: number[] }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "from collections import deque",
  "class Solution:",
  "    def maxSlidingWindow(self, nums, k):",
  "        dq, result = deque(), []",
  "        for i, num in enumerate(nums):",
  "            if dq and dq[0] <= i - k:",
  "                dq.popleft()",
  "            while dq and nums[dq[-1]] < num:",
  "                dq.pop()",
  "            dq.append(i)",
  "            if i >= k - 1:",
  "                result.append(nums[dq[0]])",
  "        return result",
];
