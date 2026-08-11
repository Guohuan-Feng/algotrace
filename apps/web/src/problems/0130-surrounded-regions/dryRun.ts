import type { Cell, FrameKind } from "../../shared/types";

export type SurroundedRegionsFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  board: string[][];
  currentCell: Cell | null;
  targetCell: Cell | null;
  stack: Cell[];
  phase: "mark" | "capture" | "restore" | "done";
  result: string[][] | null;
};

const directions: Cell[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export function createSurroundedRegionsDryRun(boardInput: string[][]): { frames: SurroundedRegionsFrame[] } {
  const board = boardInput.map((row) => [...row]);
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const stack: Cell[] = [];
  const frames: SurroundedRegionsFrame[] = [];

  const push = (frame: Omit<SurroundedRegionsFrame, "board" | "stack">) => {
    frames.push({
      ...frame,
      board: board.map((row) => [...row]),
      stack: stack.map(([row, col]) => [row, col] as Cell),
    });
  };

  push({
    kind: "start",
    title: "Read board dimensions",
    detail: `m = ${rows}, n = ${cols}. Only boundary-connected O cells are safe.`,
    activeLines: [5],
    currentCell: null,
    targetCell: null,
    phase: "mark",
    result: null,
  });

  if (!rows || !cols) {
    push({
      kind: "done",
      title: "Empty board",
      detail: "There is nothing to capture.",
      activeLines: [5],
      currentCell: null,
      targetCell: null,
      phase: "done",
      result: board.map((row) => [...row]),
    });
    return { frames };
  }

  for (let row = 0; row < rows; row += 1) {
    markBoundary(row, 0, [17]);
    markBoundary(row, cols - 1, [18]);
  }

  for (let col = 0; col < cols; col += 1) {
    markBoundary(0, col, [21]);
    markBoundary(rows - 1, col, [22]);
  }

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      push({
        kind: "visit",
        title: `Inspect (${row}, ${col})`,
        detail: `board[${row}][${col}] is ${board[row][col]}.`,
        activeLines: [25, 26],
        currentCell: [row, col],
        targetCell: null,
        phase: "capture",
        result: null,
      });
      if (board[row][col] === "O") {
        board[row][col] = "X";
        push({
          kind: "found",
          title: `Capture enclosed O at (${row}, ${col})`,
          detail: "This O was never reached from the boundary, so change it to X.",
          activeLines: [26, 27],
          currentCell: [row, col],
          targetCell: null,
          phase: "capture",
          result: null,
        });
      } else if (board[row][col] === "T") {
        board[row][col] = "O";
        push({
          kind: "backtrack",
          title: `Restore safe O at (${row}, ${col})`,
          detail: "T came from the boundary DFS, so restore it to O.",
          activeLines: [29, 30],
          currentCell: [row, col],
          targetCell: null,
          phase: "restore",
          result: null,
        });
      }
    }
  }

  push({
    kind: "done",
    title: "Board solved",
    detail: "Enclosed regions are captured and boundary-connected regions remain O.",
    activeLines: [25],
    currentCell: null,
    targetCell: null,
    phase: "done",
    result: board.map((row) => [...row]),
  });

  return { frames };

  function markBoundary(row: number, col: number, activeLines: number[]) {
    push({
      kind: "visit",
      title: `Start boundary DFS at (${row}, ${col})`,
      detail: "Only boundary O cells can start a safe-region search.",
      activeLines,
      currentCell: [row, col],
      targetCell: null,
      phase: "mark",
      result: null,
    });
    dfs(row, col);
  }

  function dfs(row: number, col: number) {
    stack.push([row, col]);
    const inside = row >= 0 && row < rows && col >= 0 && col < cols;
    const value = inside ? board[row][col] : "outside";
    push({
      kind: "visit",
      title: `dfs(${row}, ${col})`,
      detail: `Check bounds and require O; current value is ${value}.`,
      activeLines: [7, 8],
      currentCell: [row, col],
      targetCell: null,
      phase: "mark",
      result: null,
    });

    if (!inside || board[row][col] !== "O") {
      push({
        kind: "prune",
        title: "Stop DFS branch",
        detail: !inside ? "This coordinate is outside the board." : `This cell is ${board[row][col]}, not O.`,
        activeLines: [8],
        currentCell: [row, col],
        targetCell: null,
        phase: "mark",
        result: null,
      });
      stack.pop();
      return;
    }

    board[row][col] = "T";
    push({
      kind: "found",
      title: `Mark (${row}, ${col}) as T`,
      detail: "This O is boundary-connected, so temporarily protect it.",
      activeLines: [9],
      currentCell: [row, col],
      targetCell: null,
      phase: "mark",
      result: null,
    });

    directions.forEach(([dr, dc], index) => {
      const target: Cell = [row + dr, col + dc];
      push({
        kind: "visit",
        title: `Explore neighbor (${target[0]}, ${target[1]})`,
        detail: "Continue DFS from this newly protected boundary-connected cell.",
        activeLines: [11 + index],
        currentCell: [row, col],
        targetCell: target,
        phase: "mark",
        result: null,
      });
      dfs(target[0], target[1]);
    });

    stack.pop();
    push({
      kind: "backtrack",
      title: `Return from dfs(${row}, ${col})`,
      detail: "All four neighbors have been checked.",
      activeLines: [11, 12, 13, 14],
      currentCell: [row, col],
      targetCell: null,
      phase: "mark",
      result: null,
    });
  }
}
