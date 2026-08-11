export type ExtraCharactersExample = {
  id: 1 | 2;
  label: string;
  s: string;
  dictionary: string[];
  output: number;
};

export const title = "2707. Extra Characters in a String";

export const examples: ExtraCharactersExample[] = [
  {
    id: 1,
    label: "LeetCode 1",
    s: "leetscode",
    dictionary: ["leet", "code", "leetcode"],
    output: 1,
  },
  {
    id: 2,
    label: "LeetCode 2",
    s: "sayhelloworld",
    dictionary: ["hello", "world"],
    output: 3,
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def minExtraChar(self, s: str, dictionary: List[str]) -> int:",
  "        words = set(dictionary)",
  "        n = len(s)",
  "        dp = [0] * (n + 1)",
  "",
  "        for i in range(1, n + 1):",
  "            # 默认把 s[i - 1] 当作多余字符",
  "            dp[i] = dp[i - 1] + 1",
  "",
  "            # 枚举最后一个单词的起点",
  "            for j in range(i):",
  "                # 如果 s[j:i] 是字典中的单词",
  "                if s[j:i] in words:",
  "                    dp[i] = min(dp[i], dp[j])",
  "",
  "        return dp[n]",
];
