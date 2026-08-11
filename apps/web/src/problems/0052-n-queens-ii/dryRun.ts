import type { Cell, FrameKind } from "../../shared/types";

export type NQueensFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  row: number;
  col: number | null;
  queens: Cell[];
  cols: number[];
  diag1: number[];
  diag2: number[];
  conflictReasons: string[];
  stack: string[];
  resultCount: number;
};

export function createNQueensDryRun(n: number): { frames: NQueensFrame[] } {
  const frames: NQueensFrame[] = [];
  const queens: Cell[] = [];
  const cols = new Set<number>();
  const diag1 = new Set<number>();
  const diag2 = new Set<number>();
  let resultCount = 0;

  const pushFrame = (frame: Omit<NQueensFrame, "cols" | "diag1" | "diag2" | "queens" | "resultCount">) => {
    frames.push({
      ...frame,
      cols: [...cols].sort((a, b) => a - b),
      diag1: [...diag1].sort((a, b) => a - b),
      diag2: [...diag2].sort((a, b) => a - b),
      queens: queens.map(([row, col]) => [row, col]),
      resultCount,
    });
  };

  pushFrame({
    kind: "start",
    title: "Start",
    detail: `Create res = 0 and three sets for n = ${n}: cols, diag1(row - col), diag2(row + col).`,
    activeLines: [2, 3, 4, 5, 6],
    row: 0,
    col: null,
    conflictReasons: [],
    stack: [],
  });

  pushFrame({
    kind: "start",
    title: "Call dfs(0)",
    detail: "Begin by placing a queen somewhere in row 0.",
    activeLines: [27],
    row: 0,
    col: null,
    conflictReasons: [],
    stack: ["dfs(0)"],
  });

  dfs(0);

  pushFrame({
    kind: "done",
    title: "Return count",
    detail: `All rows and branches are done. Return ${resultCount}.`,
    activeLines: [28],
    row: n,
    col: null,
    conflictReasons: [],
    stack: ["return self.res"],
  });

  return { frames };

  function dfs(row: number) {
    pushFrame({
      kind: "visit",
      title: `Enter dfs(${row})`,
      detail: row === n ? "All rows are filled." : `Try each column in row ${row}.`,
      activeLines: [8, 9],
      row,
      col: null,
      conflictReasons: [],
      stack: [`dfs(${row})`],
    });

    if (row === n) {
      resultCount += 1;
      pushFrame({
        kind: "found",
        title: `Found solution #${resultCount}`,
        detail: "row == n, so every row has one queen. Increment self.res and return.",
        activeLines: [9, 10, 11],
        row,
        col: null,
        conflictReasons: [],
        stack: [`self.res += 1 -> ${resultCount}`, "return"],
      });
      return;
    }

    for (let col = 0; col < n; col += 1) {
      const reasons = conflictReasonsFor(row, col);
      pushFrame({
        kind: "start",
        title: `Try row ${row}, col ${col}`,
        detail: `Check col = ${col}: cols has ${col}, diag1 has ${row - col}, or diag2 has ${row + col}.`,
        activeLines: [13, 14],
        row,
        col,
        conflictReasons: reasons,
        stack: [`dfs(${row})`, `col = ${col}`],
      });

      if (reasons.length) {
        pushFrame({
          kind: "prune",
          title: `Skip (${row}, ${col})`,
          detail: `${reasons.join("; ")}. Continue to the next column.`,
          activeLines: [14, 15],
          row,
          col,
          conflictReasons: reasons,
          stack: [`dfs(${row})`, `col = ${col}`, "continue"],
        });
        continue;
      }

      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      queens.push([row, col]);

      pushFrame({
        kind: "visit",
        title: `Place queen at (${row}, ${col})`,
        detail: `Add col ${col}, diag1 ${row - col}, and diag2 ${row + col}; then recurse to row ${row + 1}.`,
        activeLines: [17, 18, 19, 21],
        row,
        col,
        conflictReasons: [],
        stack: [`dfs(${row})`, `place (${row}, ${col})`, `dfs(${row + 1})`],
      });

      dfs(row + 1);

      queens.pop();
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);

      pushFrame({
        kind: "backtrack",
        title: `Remove queen from (${row}, ${col})`,
        detail: `Backtrack: remove col ${col}, diag1 ${row - col}, and diag2 ${row + col}.`,
        activeLines: [23, 24, 25],
        row,
        col,
        conflictReasons: [],
        stack: [`dfs(${row})`, `undo (${row}, ${col})`],
      });
    }
  }

  function conflictReasonsFor(row: number, col: number): string[] {
    const reasons: string[] = [];
    if (cols.has(col)) {
      reasons.push(`same column: ${col} in cols`);
    }
    if (diag1.has(row - col)) {
      reasons.push(`same diag1: row - col = ${row - col}`);
    }
    if (diag2.has(row + col)) {
      reasons.push(`same diag2: row + col = ${row + col}`);
    }
    return reasons;
  }
}
