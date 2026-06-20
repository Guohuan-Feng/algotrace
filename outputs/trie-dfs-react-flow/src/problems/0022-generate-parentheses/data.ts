export type GenerateParenthesesExample = {
  id: 1 | 2 | 3;
  label: string;
  n: number;
  output: string[];
};

export const title = "Generate Parentheses: Backtracking Visualizer";

export const examples: GenerateParenthesesExample[] = [
  {
    id: 1,
    label: "Example 1",
    n: 3,
    output: ["((()))", "(()())", "(())()", "()(())", "()()()"],
  },
  {
    id: 2,
    label: "Example 2",
    n: 1,
    output: ["()"],
  },
  {
    id: 3,
    label: "Practice",
    n: 4,
    output: ["(((())))", "((()()))", "((())())", "((()))()", "(()(()))", "(()()())", "(()())()", "(())(())", "(())()()", "()((()))", "()(()())", "()(())()", "()()(())", "()()()()"],
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "from typing import List",
  "",
  "class Solution:",
  "    def generateParenthesis(self, n: int) -> List[str]:",
  "        res = []",
  "",
  "        def backtrack(path, left, right):",
  "            if len(path) == 2 * n:",
  "                res.append(path)",
  "                return",
  "",
  "            if left < n:",
  "                backtrack(path + \"(\", left + 1, right)",
  "",
  "            if right < left:",
  "                backtrack(path + \")\", left, right + 1)",
  "",
  "        backtrack(\"\", 0, 0)",
  "        return res",
];
