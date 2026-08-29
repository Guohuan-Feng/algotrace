export type HappyNumberInput = { n: number };
export const title = "202. Happy Number";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { n: 19 }, output: true },
  { id: 2, label: "LeetCode 2", input: { n: 2 }, output: false },
] satisfies Array<{ id: number; label: string; input: HappyNumberInput; output: boolean }>;
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def isHappy(self, n: int) -> bool:",
  "        seen = set()",
  "",
  "        while n != 1 and n not in seen:",
  "            seen.add(n)",
  "            n = sum(int(digit) ** 2 for digit in str(n))",
  "",
  "        return n == 1",
];
