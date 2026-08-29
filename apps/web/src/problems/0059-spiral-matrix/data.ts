export type SpiralMatrixInput = { matrix: number[][] };

export const title = "59. Spiral Matrix";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }, output: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
  { id: 2, label: "LeetCode 2", input: { matrix: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]] }, output: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
] satisfies Array<{ id: number; label: string; input: SpiralMatrixInput; output: number[] }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:",
  "        result = []",
  "        top, bottom = 0, len(matrix) - 1",
  "        left, right = 0, len(matrix[0]) - 1",
  "",
  "        while top <= bottom and left <= right:",
  "            for col in range(left, right + 1):",
  "                result.append(matrix[top][col])",
  "            top += 1",
  "",
  "            for row in range(top, bottom + 1):",
  "                result.append(matrix[row][right])",
  "            right -= 1",
  "",
  "            if top <= bottom:",
  "                for col in range(right, left - 1, -1):",
  "                    result.append(matrix[bottom][col])",
  "                bottom -= 1",
  "",
  "            if left <= right:",
  "                for row in range(bottom, top - 1, -1):",
  "                    result.append(matrix[row][left])",
  "                left += 1",
  "",
  "        return result",
];
