import type { FrameKind } from "../../shared/types";

export type NQueensFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  board: string[][];
  cols: number[];
  diag1: number[];
  diag2: number[];
  current: [number, number] | null;
  blocked: [number, number] | null;
  stack: string[];
  solutions: string[][];
  result: string[][] | null;
};

export function createNQueensDryRun(n: number): { frames: NQueensFrame[] } {
  const board = Array.from({ length: n }, () => Array.from({ length: n }, () => "."));
  const cols = new Set<number>();
  const diag1 = new Set<number>();
  const diag2 = new Set<number>();
  const solutions: string[][] = [];
  const frames: NQueensFrame[] = [];
  const callStack: string[] = [];
  const push = (frame: Omit<NQueensFrame, "board" | "cols" | "diag1" | "diag2" | "stack" | "solutions">) => frames.push({
    ...frame,
    board: board.map((row) => [...row]),
    cols: [...cols].sort((a, b) => a - b),
    diag1: [...diag1].sort((a, b) => a - b),
    diag2: [...diag2].sort((a, b) => a - b),
    stack: [...callStack],
    solutions: solutions.map((solution) => [...solution]),
  });

  push({ kind: "start", title: "Initialize board and constraint sets", detail: `Create a ${n} x ${n} empty board, then track used columns and diagonals.`, activeLines: [3, 4, 5, 6, 7], current: null, blocked: null, result: null });
  const backtrack = (row: number): void => {
    callStack.push(`backtrack(${row})`);
    push({ kind: "visit", title: `backtrack(row = ${row})`, detail: row === n ? "All rows are filled." : `Choose a safe column for row ${row}.`, activeLines: [9, 10, 14], current: null, blocked: null, result: null });
    if (row === n) {
      const solution = board.map((line) => line.join(""));
      solutions.push(solution);
      push({ kind: "found", title: `Record solution ${solutions.length}`, detail: "Every row has one queen, so append this board to res.", activeLines: [10, 11, 12], current: null, blocked: null, result: null });
      callStack.pop();
      return;
    }
    for (let col = 0; col < n; col += 1) {
      const current: [number, number] = [row, col];
      push({ kind: "visit", title: `Try row ${row}, col ${col}`, detail: "Check the column plus both diagonals before placing a queen.", activeLines: [14, 15], current, blocked: null, result: null });
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
        push({ kind: "prune", title: `Reject (${row}, ${col})`, detail: "A prior queen attacks this square, so continue to the next column.", activeLines: [15, 16], current, blocked: current, result: null });
        continue;
      }
      board[row]![col] = "Q";
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      push({ kind: "build", title: `Place Q at (${row}, ${col})`, detail: "Mark the board and reserve its column and two diagonal identifiers.", activeLines: [18, 19, 20, 21], current, blocked: null, result: null });
      backtrack(row + 1);
      board[row]![col] = ".";
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
      push({ kind: "backtrack", title: `Remove Q from (${row}, ${col})`, detail: "Undo this choice to test the next branch in the same row.", activeLines: [25, 26, 27, 28], current, blocked: null, result: null });
    }
    callStack.pop();
  };

  push({ kind: "start", title: "Call backtrack(0)", detail: "Start by placing a queen in the first row.", activeLines: [30], current: null, blocked: null, result: null });
  backtrack(0);
  push({ kind: "done", title: `Return ${solutions.length} boards`, detail: "All placements and backtracks are exhausted; return the collected boards.", activeLines: [32], current: null, blocked: null, result: solutions.map((solution) => [...solution]) });
  return { frames };
}
