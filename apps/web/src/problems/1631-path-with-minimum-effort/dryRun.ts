import type { Cell, FrameKind } from "../../shared/types";

export type MinimumEffortFrame = {
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

const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

export function createMinimumEffortDryRun(heights: number[][]): { frames: MinimumEffortFrame[] } {
  const rows = heights.length;
  const cols = heights[0].length;
  const inf = Number.POSITIVE_INFINITY;
  const dist = Array.from({ length: rows }, () => Array(cols).fill(inf));
  const heap: Array<[number, number, number]> = [];
  const frames: MinimumEffortFrame[] = [];
  const push = (f: Omit<MinimumEffortFrame, "dist" | "heap">) =>
    frames.push({ ...f, dist: dist.map((row) => [...row]), heap: [...heap].sort((a, b) => a[0] - b[0]) });

  dist[0][0] = 0;
  heap.push([0, 0, 0]);
  push({ kind: "start", title: "Initialize", detail: "dist[0][0] = 0 and heap starts with (0,0,0).", activeLines: [4, 5, 7, 8, 9, 10], current: [0, 0], target: null, updated: [0, 0], result: null });
  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);
    const [effort, row, col] = heap.shift()!;
    push({ kind: "visit", title: `Pop (${row}, ${col})`, detail: `Current path effort is ${effort}.`, activeLines: [11, 12], current: [row, col], target: null, updated: null, result: null });
    if (effort > dist[row][col]) {
      push({ kind: "prune", title: "Skip stale item", detail: `${effort} > dist[${row}][${col}] = ${dist[row][col]}.`, activeLines: [13, 14], current: [row, col], target: null, updated: null, result: null });
      continue;
    }
    if (row === rows - 1 && col === cols - 1) {
      push({ kind: "done", title: "Reached target", detail: `Return minimum effort ${effort}.`, activeLines: [15, 16], current: [row, col], target: [row, col], updated: null, result: effort });
      return { frames };
    }
    for (const [dr, dc] of directions) {
      const nr = row + dr;
      const nc = col + dc;
      push({ kind: "start", title: `Check neighbor (${nr}, ${nc})`, detail: "Validate bounds.", activeLines: [17, 18, 19, 20], current: [row, col], target: [nr, nc], updated: null, result: null });
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const diff = Math.abs(heights[nr][nc] - heights[row][col]);
      const newEffort = Math.max(effort, diff);
      if (newEffort < dist[nr][nc]) {
        dist[nr][nc] = newEffort;
        heap.push([newEffort, nr, nc]);
        push({ kind: "build", title: `Relax (${nr}, ${nc})`, detail: `diff=${diff}, new_effort=max(${effort}, ${diff})=${newEffort}.`, activeLines: [21, 22, 23, 24, 25], current: [row, col], target: [nr, nc], updated: [nr, nc], result: null });
      } else {
        push({ kind: "prune", title: "No improvement", detail: `${newEffort} is not better than ${dist[nr][nc]}.`, activeLines: [23], current: [row, col], target: [nr, nc], updated: null, result: null });
      }
    }
  }
  push({ kind: "done", title: "Return 0", detail: "The loop ended.", activeLines: [26], current: null, target: null, updated: null, result: 0 });
  return { frames };
}
