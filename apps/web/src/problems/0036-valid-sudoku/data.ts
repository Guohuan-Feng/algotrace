export type ValidSudokuInput = { board: string[][] };

export const title = "36. Valid Sudoku";
export const examples = [
  {
    id: 1,
    label: "LeetCode 1",
    input: { board: [["5", "3", ".", ".", "7", ".", ".", ".", "."], ["6", ".", ".", "1", "9", "5", ".", ".", "."], [".", "9", "8", ".", ".", ".", ".", "6", "."], ["8", ".", ".", ".", "6", ".", ".", ".", "3"], ["4", ".", ".", "8", ".", "3", ".", ".", "1"], ["7", ".", ".", ".", "2", ".", ".", ".", "6"], [".", "6", ".", ".", ".", ".", "2", "8", "."], [".", ".", ".", "4", "1", "9", ".", ".", "5"], [".", ".", ".", ".", "8", ".", ".", "7", "9"]] },
    output: true,
  },
  {
    id: 2,
    label: "LeetCode 2",
    input: { board: [["8", "3", ".", ".", "7", ".", ".", ".", "."], ["6", ".", ".", "1", "9", "5", ".", ".", "."], [".", "9", "8", ".", ".", ".", ".", "6", "."], ["8", ".", ".", ".", "6", ".", ".", ".", "3"], ["4", ".", ".", "8", ".", "3", ".", ".", "1"], ["7", ".", ".", ".", "2", ".", ".", ".", "6"], [".", "6", ".", ".", ".", ".", "2", "8", "."], [".", ".", ".", "4", "1", "9", ".", ".", "5"], [".", ".", ".", ".", "8", ".", ".", "7", "9"]] },
    output: false,
  },
] satisfies Array<{ id: number; label: string; input: ValidSudokuInput; output: boolean }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def isValidSudoku(self, board: List[List[str]]) -> bool:",
  "        rows = [set() for _ in range(9)]",
  "        cols = [set() for _ in range(9)]",
  "        boxes = [set() for _ in range(9)]",
  "",
  "        for row in range(9):",
  "            for col in range(9):",
  "                value = board[row][col]",
  "                if value == '.':",
  "                    continue",
  "                box = (row // 3) * 3 + col // 3",
  "                if value in rows[row] or value in cols[col] or value in boxes[box]:",
  "                    return False",
  "                rows[row].add(value)",
  "                cols[col].add(value)",
  "                boxes[box].add(value)",
  "",
  "        return True",
];
