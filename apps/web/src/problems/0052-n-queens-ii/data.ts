export type NQueensExample = {
  id: 1 | 2 | 3;
  label: string;
  n: number;
  output: number;
};

export const title = "N-Queens II: Backtracking Visualizer";

export const examples: NQueensExample[] = [
  {
    id: 1,
    label: "Example 1",
    n: 4,
    output: 2,
  },
  {
    id: 2,
    label: "Example 2",
    n: 1,
    output: 1,
  },
  {
    id: 3,
    label: "Practice",
    n: 5,
    output: 10,
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "class Solution:",
  "    def totalNQueens(self, n: int) -> int:",
  "        self.res = 0",
  "        cols = set()",
  "        diag1 = set()",
  "        diag2 = set()",
  "",
  "        def dfs(row):",
  "            if row == n:",
  "                self.res += 1",
  "                return",
  "",
  "            for col in range(n):",
  "                if col in cols or row - col in diag1 or row + col in diag2:",
  "                    continue",
  "",
  "                cols.add(col)",
  "                diag1.add(row - col)",
  "                diag2.add(row + col)",
  "",
  "                dfs(row + 1)",
  "",
  "                cols.remove(col)",
  "                diag1.remove(row - col)",
  "                diag2.remove(row + col)",
  "",
  "        dfs(0)",
  "        return self.res",
];
