export type LetterCombinationExample = {
  id: 1 | 2 | 3;
  label: string;
  digits: string;
  output: string[];
};

export const title = "Letter Combinations: Phone DFS Visualizer";

export const phoneMap = {
  "2": "abc",
  "3": "def",
  "4": "ghi",
  "5": "jkl",
  "6": "mno",
  "7": "pqrs",
  "8": "tuv",
  "9": "wxyz",
} as const;

export const examples: LetterCombinationExample[] = [
  {
    id: 1,
    label: "Example 1",
    digits: "23",
    output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"],
  },
  {
    id: 2,
    label: "Example 2",
    digits: "",
    output: [],
  },
  {
    id: 3,
    label: "Example 3",
    digits: "2",
    output: ["a", "b", "c"],
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def letterCombinations(self, digits: str) -> List[str]:",
  "        if not digits:",
  "            return []",
  "",
  "        phone = {",
  "            \"2\": \"abc\",",
  "            \"3\": \"def\",",
  "            \"4\": \"ghi\",",
  "            \"5\": \"jkl\",",
  "            \"6\": \"mno\",",
  "            \"7\": \"pqrs\",",
  "            \"8\": \"tuv\",",
  "            \"9\": \"wxyz\"",
  "        }",
  "",
  "        res = []",
  "",
  "        def dfs(index, path):",
  "            if index == len(digits):",
  "                res.append(path)",
  "                return",
  "",
  "            letters = phone[digits[index]]",
  "",
  "            for ch in letters:",
  "                dfs(index + 1, path + ch)",
  "",
  "        dfs(0, \"\")",
  "        return res",
];
