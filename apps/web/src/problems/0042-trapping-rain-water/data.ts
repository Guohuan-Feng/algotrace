export type TrappingRainWaterInput = { height: number[] };

export const title = "42. Trapping Rain Water";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, output: 6 },
  { id: 2, label: "LeetCode 2", input: { height: [4, 2, 0, 3, 2, 5] }, output: 9 },
] satisfies Array<{ id: number; label: string; input: TrappingRainWaterInput; output: number }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def trap(self, height: List[int]) -> int:",
  "        left, right = 0, len(height) - 1",
  "        left_max = right_max = 0",
  "        water = 0",
  "",
  "        while left <= right:",
  "            if height[left] <= height[right]:",
  "                left_max = max(left_max, height[left])",
  "                water += left_max - height[left]",
  "                left += 1",
  "            else:",
  "                right_max = max(right_max, height[right])",
  "                water += right_max - height[right]",
  "                right -= 1",
  "",
  "        return water",
];
