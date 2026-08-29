export type MinimumWindowInput = { s: string; t: string };

export const title = "76. Minimum Window Substring";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { s: "ADOBECODEBANC", t: "ABC" }, output: "BANC" },
  { id: 2, label: "LeetCode 2", input: { s: "a", t: "a" }, output: "a" },
  { id: 3, label: "LeetCode 3", input: { s: "a", t: "aa" }, output: "" },
] satisfies Array<{ id: number; label: string; input: MinimumWindowInput; output: string }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "from collections import Counter",
  "class Solution:",
  "    def minWindow(self, s, t):",
  "        need, window = Counter(t), {}",
  "        formed, required, left, best = 0, len(need), 0, None",
  "        for right, char in enumerate(s):",
  "            window[char] = window.get(char, 0) + 1",
  "            if char in need and window[char] == need[char]: formed += 1",
  "            while formed == required:",
  "                candidate = s[left:right + 1]",
  "                if best is None or len(candidate) < best[1]: best = (left, len(candidate))",
  "                removed = s[left]",
  "                window[removed] -= 1",
  "                if removed in need and window[removed] < need[removed]: formed -= 1",
  "                left += 1",
  "        return '' if best is None else s[best[0]:best[0] + best[1]]",
];
