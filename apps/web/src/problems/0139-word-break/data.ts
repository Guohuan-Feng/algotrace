import type { LinearDpExample } from "../../shared/components/LinearDpVisualizer";

export type WordBreakInput = { s: string; wordDict: string[] };

export const title = "139. Word Break";
export const examples: LinearDpExample<WordBreakInput>[] = [
  { id: 1, label: "LeetCode 1", input: { s: "leetcode", wordDict: ["leet", "code"] }, output: true },
  { id: 2, label: "LeetCode 2", input: { s: "catsandog", wordDict: ["cats", "dog", "sand", "and", "cat"] }, output: false },
];
export const defaultExample = examples[0];
export const codeLines = [
  "class Solution:",
  "    def wordBreak(self, s: str, wordDict: List[str]) -> bool:",
  "        wordSet = set(wordDict)",
  "",
  "        n = len(s)",
  "        dp = [False] * (n + 1)",
  "",
  "        dp[0] = True",
  "",
  "        for i in range(1, n + 1):",
  "            for j in range(0, i):",
  "                if dp[j] and s[j:i] in wordSet:",
  "                    dp[i] = True",
  "                    break",
  "",
  "        return dp[n]",
];
