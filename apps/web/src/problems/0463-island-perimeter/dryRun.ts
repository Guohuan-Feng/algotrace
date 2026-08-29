import type { Cell, FrameKind } from "../../shared/types";

export type IslandPerimeterFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  grid: number[][];
  current: Cell | null;
  target: Cell | null;
  stack: Cell[];
  perimeter: number;
  result: number | null;
};

export function createIslandPerimeterDryRun(gridInput: number[][]): { frames: IslandPerimeterFrame[] } {
  const grid = gridInput.map((row) => [...row]);
  const m = grid.length;
  const n = grid[0]?.length ?? 0;
  const frames: IslandPerimeterFrame[] = [];
  const stack: Cell[] = [];
  let perimeter = 0;
  const push = (frame: Omit<IslandPerimeterFrame, "grid" | "stack" | "perimeter">) => frames.push({
    ...frame,
    grid: grid.map((row) => [...row]),
    stack: stack.map(([row, col]) => [row, col] as Cell),
    perimeter,
  });

  push({ kind: "start", title: "Read grid", detail: `m = ${m}, n = ${n}. DFS will count each edge next to water or the boundary.`, activeLines: [2, 3], current: null, target: null, result: null });
  const dfs = (i: number, j: number): number => {
    const current: Cell = [i, j];
    push({ kind: "visit", title: `dfs(${i}, ${j})`, detail: "Determine whether this direction contributes a perimeter edge or reaches unvisited land.", activeLines: [5, 7, 10, 13], current, target: null, result: null });
    if (i < 0 || i >= m || j < 0 || j >= n) {
      perimeter += 1;
      push({ kind: "found", title: "Boundary contributes 1", detail: "DFS stepped outside the grid, so the island side is exposed.", activeLines: [7, 8], current, target: null, result: null });
      return 1;
    }
    if (grid[i]![j] === 0) {
      perimeter += 1;
      push({ kind: "found", title: "Water contributes 1", detail: "This adjacent water cell exposes one edge of the island.", activeLines: [10, 11], current, target: null, result: null });
      return 1;
    }
    if (grid[i]![j] === 2) {
      push({ kind: "prune", title: "Visited land contributes 0", detail: "A land cell marked 2 has already been included in this DFS, so do not count it again.", activeLines: [13, 14], current, target: null, result: null });
      return 0;
    }

    stack.push(current);
    grid[i]![j] = 2;
    push({ kind: "build", title: `Mark (${i}, ${j}) as visited`, detail: "Turn 1 into 2 before exploring its four sides.", activeLines: [17], current, target: null, result: null });
    let total = 0;
    for (const [di, dj, line] of [[1, 0, 20], [-1, 0, 21], [0, 1, 22], [0, -1, 23]] as const) {
      const target: Cell = [i + di, j + dj];
      push({ kind: "visit", title: `Explore (${target[0]}, ${target[1]})`, detail: "Each recursive call returns the exposed-edge contribution of one direction.", activeLines: [19, line], current, target, result: null });
      total += dfs(target[0], target[1]);
      push({ kind: "build", title: `Partial return = ${total}`, detail: "Add this neighbor's contribution to the current land cell's return value.", activeLines: [19, 20, 21, 22, 23], current, target, result: null });
    }
    stack.pop();
    push({ kind: "backtrack", title: `Return ${total} from (${i}, ${j})`, detail: "All four directions are complete; return their total to the previous land cell.", activeLines: [19, 24], current, target: null, result: null });
    return total;
  };

  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      push({ kind: "visit", title: `Scan (${i}, ${j})`, detail: grid[i]![j] === 1 ? "This is the island's first land cell, so start DFS." : "Continue scanning until a land cell is found.", activeLines: [26, 27, 28], current: [i, j], target: null, result: null });
      if (grid[i]![j] === 1) {
        const result = dfs(i, j);
        push({ kind: "done", title: `Return ${result}`, detail: "The first DFS traversed the complete island and summed every exposed edge.", activeLines: [28, 29], current: null, target: null, result });
        return { frames };
      }
    }
  }
  push({ kind: "done", title: "Return 0", detail: "No land cell was found.", activeLines: [26], current: null, target: null, result: 0 });
  return { frames };
}
