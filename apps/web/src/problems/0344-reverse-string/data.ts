export type ReverseStringInput = { s: string[] };
export type ReverseStringExample = { id: number; label: string; input: ReverseStringInput; output: string[] };

export const title = "344. Reverse String";
export const examples: ReverseStringExample[] = [
  { id: 1, label: "LeetCode 1", input: { s: ["h", "e", "l", "l", "o"] }, output: ["o", "l", "l", "e", "h"] },
  { id: 2, label: "LeetCode 2", input: { s: ["H", "a", "n", "n", "a", "h"] }, output: ["h", "a", "n", "n", "a", "H"] },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def reverseString(self, s: List[str]) -> None:",
  "        left, right = 0, len(s) - 1",
  "",
  "        while left < right:",
  "            s[left], s[right] = s[right], s[left]",
  "            left += 1",
  "            right -= 1",
];
