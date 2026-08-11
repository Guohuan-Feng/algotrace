export type SqrtExample = {
  id: 1 | 2 | 3;
  label: string;
  x: number;
  output: number;
};

export const title = "69. Sqrt(x)";

export const examples: SqrtExample[] = [
  { id: 1, label: "LeetCode 1", x: 4, output: 2 },
  { id: 2, label: "LeetCode 2", x: 8, output: 2 },
  { id: 3, label: "Boundary demo", x: 10, output: 3 },
];

export const defaultExample = examples[2];

export const codeLines = [
  "class Solution:",
  "    def mySqrt(self, x: int) -> int:",
  "        left, right = 0, x",
  "",
  "        while left <= right:",
  "            mid = left + (right - left) // 2",
  "",
  "            if mid * mid <= x:",
  "                left = mid + 1",
  "            else:",
  "                right = mid - 1",
  "",
  "        return right",
];
