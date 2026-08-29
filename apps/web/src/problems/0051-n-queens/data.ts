export type NQueensExample = { id: 1 | 2; label: string; n: number; output: string[][] };

export const title = "51. N-Queens";

export const examples: NQueensExample[] = [
  { id: 1, label: "LeetCode 1", n: 4, output: [[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]] },
  { id: 2, label: "LeetCode 2", n: 1, output: [["Q"]] },
];

export const defaultExample = examples[0];

export const codeLines = [
  "class Solution:",
  "    def solveNQueens(self, n: int) -> List[List[str]]:",
  "        res = []",
  "        board = [[\".\"] * n for _ in range(n)]",
  "        cols = set()",
  "        diag1 = set()",
  "        diag2 = set()",
  "",
  "        def backtrack(row):",
  "            if row == n:",
  "                res.append([\"\".join(line) for line in board])",
  "                return",
  "",
  "            for col in range(n):",
  "                if col in cols or row - col in diag1 or row + col in diag2:",
  "                    continue",
  "",
  "                board[row][col] = \"Q\"",
  "                cols.add(col)",
  "                diag1.add(row - col)",
  "                diag2.add(row + col)",
  "",
  "                backtrack(row + 1)",
  "",
  "                board[row][col] = \".\"",
  "                cols.remove(col)",
  "                diag1.remove(row - col)",
  "                diag2.remove(row + col)",
  "",
  "        backtrack(0)",
  "",
  "        return res",
];
