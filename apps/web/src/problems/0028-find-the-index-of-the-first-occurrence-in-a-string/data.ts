export type FirstOccurrenceInput = { haystack: string; needle: string };

export const title = "28. Find the Index of the First Occurrence in a String";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { haystack: "sadbutsad", needle: "sad" }, output: 0 },
  { id: 2, label: "LeetCode 2", input: { haystack: "leetcode", needle: "leeto" }, output: -1 },
] satisfies Array<{ id: number; label: string; input: FirstOccurrenceInput; output: number }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def strStr(self, haystack: str, needle: str) -> int:",
  "        if needle == \"\":",
  "            return 0",
  "",
  "        for start in range(len(haystack) - len(needle) + 1):",
  "            matched = True",
  "            for offset in range(len(needle)):",
  "                if haystack[start + offset] != needle[offset]:",
  "                    matched = False",
  "                    break",
  "            if matched:",
  "                return start",
  "        return -1",
];
