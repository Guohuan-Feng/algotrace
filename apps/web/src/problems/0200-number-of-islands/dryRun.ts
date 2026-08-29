import type { Cell, FrameKind } from "../../shared/types";

export type NumberOfIslandsFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  grid: string[][];
  count: number;
  stack: Cell[];
  current: Cell | null;
  target: Cell | null;
  result: number | null;
};

const directions: Cell[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export function createNumberOfIslandsDryRun(gridInput: string[][]): { frames: NumberOfIslandsFrame[] } {
  const grid = gridInput.map((row) => [...row]);
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const stack: Cell[] = [];
  const frames: NumberOfIslandsFrame[] = [];
  let count = 0;
  const push = (frame: Omit<NumberOfIslandsFrame, "grid" | "count" | "stack">) => frames.push({ ...frame, grid: grid.map((row) => [...row]), count, stack: stack.map(([row, col]) => [row, col] as Cell) });

  push({ kind: "start", title: "Read grid dimensions", detail: `m = ${rows}, n = ${cols}; count begins at 0.`, activeLines: [2, 3, 4], current: null, target: null, result: null });
  const dfs = (i: number, j: number): void => {
    const current: Cell = [i, j];
    push({ kind: "visit", title: `dfs(${i}, ${j})`, detail: "First reject coordinates outside the grid or water cells.", activeLines: [6, 7, 8, 10, 11], current, target: null, result: null });
    if (i < 0 || i >= rows || j < 0 || j >= cols) {
      push({ kind: "prune", title: "Outside grid", detail: "This direction has no cell to explore.", activeLines: [7, 8], current, target: null, result: null });
      return;
    }
    if (grid[i]![j] === "0") {
      push({ kind: "prune", title: "Water or explored land", detail: "A 0 does not belong to an uncounted island.", activeLines: [10, 11], current, target: null, result: null });
      return;
    }

    stack.push(current);
    grid[i]![j] = "0";
    push({ kind: "found", title: `Mark (${i}, ${j}) as water`, detail: "Overwrite the land cell so this same island cannot be counted twice.", activeLines: [13], current, target: null, result: null });
    for (const [di, dj] of directions) {
      const target: Cell = [i + di, j + dj];
      push({ kind: "visit", title: `Explore (${target[0]}, ${target[1]})`, detail: "DFS checks all four neighboring coordinates.", activeLines: [15, 16, 17, 18], current, target, result: null });
      dfs(target[0], target[1]);
    }
    stack.pop();
    push({ kind: "backtrack", title: `Return from (${i}, ${j})`, detail: "This branch has erased every connected land cell.", activeLines: [15], current, target: null, result: null });
  };

  for (let i = 0; i < rows; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      const current: Cell = [i, j];
      push({ kind: "visit", title: `Scan (${i}, ${j})`, detail: grid[i]![j] === "1" ? "Unvisited land starts a new island." : "Water is skipped by the outer scan.", activeLines: [20, 21, 22], current, target: null, result: null });
      if (grid[i]![j] === "1") {
        count += 1;
        push({ kind: "found", title: `count = ${count}`, detail: "This is the first unvisited cell of a new island.", activeLines: [22, 23], current, target: null, result: null });
        dfs(i, j);
      }
    }
  }
  push({ kind: "done", title: `Return ${count}`, detail: "Every island was counted once, then converted to water.", activeLines: [26], current: null, target: null, result: count });
  return { frames };
}
