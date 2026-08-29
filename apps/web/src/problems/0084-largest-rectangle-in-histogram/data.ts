export type LargestRectangleInput = { heights: number[] };

export const title = "84. Largest Rectangle in Histogram";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { heights: [2, 1, 5, 6, 2, 3] }, output: 10 },
  { id: 2, label: "LeetCode 2", input: { heights: [2, 4] }, output: 4 },
] satisfies Array<{ id: number; label: string; input: LargestRectangleInput; output: number }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def largestRectangleArea(self, heights):",
  "        stack, max_area = [], 0",
  "        for index in range(len(heights) + 1):",
  "            current = heights[index] if index < len(heights) else 0",
  "            while stack and heights[stack[-1]] > current:",
  "                height = heights[stack.pop()]",
  "                left = stack[-1] if stack else -1",
  "                width = index - left - 1",
  "                max_area = max(max_area, height * width)",
  "            if index < len(heights): stack.append(index)",
  "        return max_area",
];
