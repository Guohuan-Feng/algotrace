export type LongestSubstringInput = { s: string };

export const title = "3. Longest Substring Without Repeating Characters";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { s: "abcabcbb" }, output: 3 },
  { id: 2, label: "LeetCode 2", input: { s: "bbbbb" }, output: 1 },
  { id: 3, label: "LeetCode 3", input: { s: "pwwkew" }, output: 3 },
] satisfies Array<{ id: number; label: string; input: LongestSubstringInput; output: number }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def lengthOfLongestSubstring(self, s):",
  "        chars, left, result = set(), 0, 0",
  "        for right, char in enumerate(s):",
  "            while char in chars:",
  "                chars.remove(s[left])",
  "                left += 1",
  "            chars.add(char)",
  "            result = max(result, right - left + 1)",
  "        return result",
];
