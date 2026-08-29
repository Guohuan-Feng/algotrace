import type { Cell, FrameKind } from "../../shared/types";

export type MaxAreaOfIslandFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  grid: number[][];
  ans: number;
  stack: Cell[];
  current: Cell | null;
  target: Cell | null;
  area: number | null;
  result: number | null;
};

const directions: Cell[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export function createMaxAreaOfIslandDryRun(gridInput: number[][]): { frames: MaxAreaOfIslandFrame[] } {
  const grid = gridInput.map((row) => [...row]);
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const stack: Cell[] = [];
  const frames: MaxAreaOfIslandFrame[] = [];
  let ans = 0;
  const push = (frame: Omit<MaxAreaOfIslandFrame, "grid" | "ans" | "stack">) => frames.push({ ...frame, grid: grid.map((row) => [...row]), ans, stack: stack.map(([row, col]) => [row, col] as Cell) });

  push({ kind: "start", title: "Read grid and initialize ans", detail: `m = ${rows}, n = ${cols}, ans = 0.`, activeLines: [2, 3, 4], current: null, target: null, area: null, result: null });
  const dfs = (i: number, j: number): number => {
    const current: Cell = [i, j];
    push({ kind: "visit", title: `dfs(${i}, ${j})`, detail: "Reject out-of-bounds positions and water before adding to the area.", activeLines: [6, 7, 8, 10, 11], current, target: null, area: null, result: null });
    if (i < 0 || i >= rows || j < 0 || j >= cols) {
      push({ kind: "prune", title: "Outside grid returns 0", detail: "This path contributes no land area.", activeLines: [7, 8], current, target: null, area: 0, result: null });
      return 0;
    }
    if (grid[i]![j] === 0) {
      push({ kind: "prune", title: "Water returns 0", detail: "A 0 is water or land already erased by this DFS.", activeLines: [10, 11], current, target: null, area: 0, result: null });
      return 0;
    }

    stack.push(current);
    grid[i]![j] = 0;
    let area = 1;
    push({ kind: "found", title: `Claim (${i}, ${j})`, detail: "Turn this land cell into 0; its own contribution is 1.", activeLines: [13, 15, 16], current, target: null, area, result: null });
    for (const [di, dj] of directions) {
      const target: Cell = [i + di, j + dj];
      push({ kind: "visit", title: `Add DFS area from (${target[0]}, ${target[1]})`, detail: "The four recursive return values are added to this island's area.", activeLines: [17, 18, 19, 20], current, target, area, result: null });
      area += dfs(target[0], target[1]);
      push({ kind: "build", title: `Partial area = ${area}`, detail: "Include the return value from the neighbor call.", activeLines: [15, 16, 17, 18, 19, 20], current, target, area, result: null });
    }
    stack.pop();
    push({ kind: "backtrack", title: `Return area ${area}`, detail: "This recursive call has counted all connected land reachable from its cell.", activeLines: [15, 21], current, target: null, area, result: null });
    return area;
  };

  for (let i = 0; i < rows; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      const current: Cell = [i, j];
      push({ kind: "visit", title: `Scan (${i}, ${j})`, detail: grid[i]![j] === 1 ? "This land cell starts an area DFS." : "Water is skipped by the outer loops.", activeLines: [23, 24, 25], current, target: null, area: null, result: null });
      if (grid[i]![j] === 1) {
        const islandArea = dfs(i, j);
        const previous = ans;
        ans = Math.max(ans, islandArea);
        push({ kind: "found", title: `ans = max(${previous}, ${islandArea}) = ${ans}`, detail: "Keep the best completed island area seen so far.", activeLines: [25, 26], current, target: null, area: islandArea, result: null });
      }
    }
  }
  push({ kind: "done", title: `Return ${ans}`, detail: "ans is the maximum of every completed DFS island area.", activeLines: [28], current: null, target: null, area: null, result: ans });
  return { frames };
}
