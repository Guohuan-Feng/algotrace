export type LongestPalindromicSubstringExample = {
  id: 1 | 2;
  label: string;
  s: string;
  output: string;
  note?: string;
};

export const title = "5. Longest Palindromic Substring";

export const examples: LongestPalindromicSubstringExample[] = [
  {
    id: 1,
    label: "LeetCode 1",
    s: "babad",
    output: "bab",
    note: "'aba' is also accepted; this exact max() call keeps the earlier tie, 'bab'.",
  },
  { id: 2, label: "LeetCode 2", s: "cbbd", output: "bb" },
];

export const defaultExample = examples[0];

export const codeLines = [
  "class Solution:",
  "    def longestPalindrome(self, s: str) -> str:",
  "        def expand(l, r):",
  "            while l >= 0 and r < len(s) and s[l] == s[r]:",
  "                l -= 1",
  "                r += 1",
  "            return s[l + 1:r]",
  "",
  "        res = \"\"",
  "",
  "        for i in range(len(s)):",
  "            s1 = expand(i, i)",
  "            s2 = expand(i, i + 1)",
  "            res = max(res, s1, s2, key=len)",
  "",
  "        return res",
];
