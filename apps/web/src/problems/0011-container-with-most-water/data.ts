export type ContainerWaterInput = { height: number[] };

export const title = "11. Container With Most Water";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, output: 49 },
  { id: 2, label: "LeetCode 2", input: { height: [1, 1] }, output: 1 },
] satisfies Array<{ id: number; label: string; input: ContainerWaterInput; output: number }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def maxArea(self, height: List[int]) -> int:",
  "        left, right = 0, len(height) - 1",
  "        max_area = 0",
  "",
  "        while left < right:",
  "            width = right - left",
  "            container_height = min(height[left], height[right])",
  "            area = width * container_height",
  "            max_area = max(max_area, area)",
  "",
  "            if height[left] < height[right]:",
  "                left += 1",
  "            else:",
  "                right -= 1",
  "",
  "        return max_area",
];
