export type LongestCommonPrefixInput = { strs: string[] };

export const title = "14. Longest Common Prefix";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { strs: ["flower", "flow", "flight"] }, output: "fl" },
  { id: 2, label: "LeetCode 2", input: { strs: ["dog", "racecar", "car"] }, output: "" },
] satisfies Array<{ id: number; label: string; input: LongestCommonPrefixInput; output: string }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def longestCommonPrefix(self, strs: List[str]) -> str:",
  "        if not strs:",
  '            return ""',
  "",
  "        prefix = strs[0]",
  "        for word in strs[1:]:",
  "            while not word.startswith(prefix):",
  "                prefix = prefix[:-1]",
  '        return prefix',
];
