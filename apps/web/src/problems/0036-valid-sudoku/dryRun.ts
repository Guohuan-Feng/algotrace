import type { Cell, FrameKind } from "../../shared/types";

export type SudokuConflict = "row" | "column" | "box" | null;

export type ValidSudokuFrame = {
  kind: FrameKind;
  phase: "initialize" | "inspect" | "place" | "conflict" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  board: string[][];
  current: Cell | null;
  conflictCell: Cell | null;
  conflict: SudokuConflict;
  box: number | null;
  rowValues: string[];
  colValues: string[];
  boxValues: string[];
  result: boolean | null;
};

export function createValidSudokuDryRun(board: string[][]): { frames: ValidSudokuFrame[] } {
  const frames: ValidSudokuFrame[] = [];
  const rows = Array.from({ length: 9 }, () => new Map<string, Cell>());
  const cols = Array.from({ length: 9 }, () => new Map<string, Cell>());
  const boxes = Array.from({ length: 9 }, () => new Map<string, Cell>());
  const snapshot = (frame: Omit<ValidSudokuFrame, "board" | "rowValues" | "colValues" | "boxValues">) => {
    const [row, col] = frame.current ?? [0, 0];
    const box = frame.box ?? 0;
    frames.push({ ...frame, board: board.map((values) => [...values]), rowValues: [...rows[row]!.keys()], colValues: [...cols[col]!.keys()], boxValues: [...boxes[box]!.keys()] });
  };

  snapshot({ kind: "start", phase: "initialize", title: "Create row, column, and box sets", detail: "Each set remembers the digits already used in that row, column, or 3x3 box.", activeLines: [2, 3, 4], current: null, conflictCell: null, conflict: null, box: null, result: null });
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const value = board[row]?.[col] ?? ".";
      if (value === ".") continue;
      const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
      const current: Cell = [row, col];
      snapshot({ kind: "visit", phase: "inspect", title: "Check digit " + value + " at (" + row + ", " + col + ")", detail: "This digit belongs to row " + row + ", column " + col + ", and box " + box + ".", activeLines: [6, 7, 8, 9, 10, 11], current, conflictCell: null, conflict: null, box, result: null });
      const rowConflict = rows[row]!.get(value) ?? null;
      const colConflict = cols[col]!.get(value) ?? null;
      const boxConflict = boxes[box]!.get(value) ?? null;
      const conflict = rowConflict ? "row" : colConflict ? "column" : boxConflict ? "box" : null;
      const conflictCell = rowConflict ?? colConflict ?? boxConflict;
      if (conflict) {
        snapshot({ kind: "prune", phase: "conflict", title: "Duplicate digit in the same " + conflict, detail: value + " already appears at (" + conflictCell![0] + ", " + conflictCell![1] + "), so the board is invalid.", activeLines: [12, 13], current, conflictCell, conflict, box, result: false });
        return { frames };
      }
      rows[row]!.set(value, current);
      cols[col]!.set(value, current);
      boxes[box]!.set(value, current);
      snapshot({ kind: "build", phase: "place", title: "Record " + value + " in all three sets", detail: "No duplicate exists, so add " + value + " to its row, column, and box history.", activeLines: [14, 15, 16], current, conflictCell: null, conflict: null, box, result: null });
    }
  }
  snapshot({ kind: "done", phase: "done", title: "All filled cells obey Sudoku rules", detail: "Every digit passed its row, column, and box checks. Return True.", activeLines: [18], current: null, conflictCell: null, conflict: null, box: null, result: true });
  return { frames };
}
