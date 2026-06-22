import type { Cell, FrameKind } from "../../types";

export type WeightedGridFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  dist: number[][];
  heap: Array<[number, number, number]>;
  current: Cell | null;
  target: Cell | null;
  updated: Cell | null;
  result: number | null;
};

const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

export function createWeightedGridDryRun(grid: number[][]): { frames: WeightedGridFrame[] } {
  const n = grid.length;
  const inf = Number.POSITIVE_INFINITY;
  const dist = Array.from({ length: n }, () => Array(n).fill(inf));
  const heap: Array<[number, number, number]> = [];
  const frames: WeightedGridFrame[] = [];
  const push = (f: Omit<WeightedGridFrame, "dist" | "heap">) =>
    frames.push({ ...f, dist: dist.map((row) => [...row]), heap: [...heap].sort((a, b) => a[0] - b[0]) });

  push({ kind: "start", title: "Initialize", detail: "Check start/end and prepare dist + min heap.", activeLines: [4, 5, 7, 8], current: null, target: null, updated: null, result: null });
  if (grid[0][0] === -1 || grid[n - 1][n - 1] === -1) {
    push({ kind: "done", title: "Blocked endpoint", detail: "Start or target is blocked, return -1.", activeLines: [5, 6], current: null, target: null, updated: null, result: -1 });
    return { frames };
  }
  dist[0][0] = grid[0][0];
  heap.push([grid[0][0], 0, 0]);
  push({ kind: "build", title: "Push start", detail: `dist[0][0] = ${grid[0][0]}.`, activeLines: [9, 10, 11], current: [0, 0], target: null, updated: [0, 0], result: null });

  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);
    const [cost, row, col] = heap.shift()!;
    push({ kind: "visit", title: `Pop (${row}, ${col})`, detail: `Current cheapest cost is ${cost}.`, activeLines: [12, 13], current: [row, col], target: null, updated: null, result: null });
    if (cost > dist[row][col]) {
      push({ kind: "prune", title: "Skip stale heap item", detail: `${cost} > dist[${row}][${col}] = ${dist[row][col]}.`, activeLines: [14, 15], current: [row, col], target: null, updated: null, result: null });
      continue;
    }
    if (row === n - 1 && col === n - 1) {
      push({ kind: "done", title: "Reached target", detail: `Return ${cost}.`, activeLines: [16, 17], current: [row, col], target: [row, col], updated: null, result: cost });
      return { frames };
    }
    for (const [dr, dc] of directions) {
      const nr = row + dr;
      const nc = col + dc;
      push({ kind: "start", title: `Check neighbor (${nr}, ${nc})`, detail: "Validate bounds and obstacle.", activeLines: [18, 19, 20, 21], current: [row, col], target: [nr, nc], updated: null, result: null });
      if (nr < 0 || nr >= n || nc < 0 || nc >= n || grid[nr][nc] === -1) continue;
      const newCost = cost + grid[nr][nc];
      if (newCost < dist[nr][nc]) {
        dist[nr][nc] = newCost;
        heap.push([newCost, nr, nc]);
        push({ kind: "build", title: `Relax (${nr}, ${nc})`, detail: `new_cost = ${newCost}; update dist and push heap.`, activeLines: [22, 23, 24, 25], current: [row, col], target: [nr, nc], updated: [nr, nc], result: null });
      } else {
        push({ kind: "prune", title: "No improvement", detail: `${newCost} is not better than current dist ${dist[nr][nc]}.`, activeLines: [23], current: [row, col], target: [nr, nc], updated: null, result: null });
      }
    }
  }
  push({ kind: "done", title: "No path", detail: "Heap is empty, return -1.", activeLines: [26], current: null, target: null, updated: null, result: -1 });
  return { frames };
}
