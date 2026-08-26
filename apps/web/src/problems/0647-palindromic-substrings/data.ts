export type PalindromicSubstringsExample = {
  id: 1 | 2;
  label: string;
  s: string;
  output: number;
};

export const title = "647. Palindromic Substrings";

export const examples: PalindromicSubstringsExample[] = [
  { id: 1, label: "LeetCode 1", s: "abc", output: 3 },
  { id: 2, label: "LeetCode 2", s: "aaa", output: 6 },
];

export const defaultExample = examples[1];

export const codeLines = [
  "class Solution:",
  "    def countSubstrings(self, s: str) -> int:",
  "        def expand(l, r):",
  "            count = 0",
  "",
  "            while l >= 0 and r < len(s) and s[l] == s[r]:",
  "                count += 1",
  "                l -= 1",
  "                r += 1",
  "",
  "            return count",
  "",
  "        res = 0",
  "",
  "        for i in range(len(s)):",
  "            res += expand(i, i)       # odd-length palindromes",
  "            res += expand(i, i + 1)   # even-length palindromes",
  "",
  "        return res",
];
