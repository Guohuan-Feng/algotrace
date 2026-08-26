import type { Cell, FrameKind } from "../../shared/types";

export type SwimHeapEntry = [number, number, number];

export type SwimInWaterFrame = {
  kind: FrameKind;
  phase: "initialize" | "pop" | "skip" | "visit" | "target" | "directions" | "bounds" | "calculate" | "push" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  grid: number[][];
  heap: SwimHeapEntry[];
  visited: Cell[];
  current: Cell | null;
  neighbor: Cell | null;
  time: number | null;
  newTime: number | null;
  result: number | null;
};

const directions: Cell[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const cellKey = ([row, col]: Cell) => `${row},${col}`;
const byHeapOrder = (left: SwimHeapEntry, right: SwimHeapEntry) => left[0] - right[0] || left[1] - right[1] || left[2] - right[2];

export function createSwimInWaterDryRun(gridInput: number[][]): { frames: SwimInWaterFrame[] } {
  const grid = gridInput.map((row) => [...row]);
  const n = grid.length;
  const heap: SwimHeapEntry[] = n ? [[grid[0][0], 0, 0]] : [];
  const visited = new Set<string>();
  const visitedCells: Cell[] = [];
  const frames: SwimInWaterFrame[] = [];

  const push = (frame: Omit<SwimInWaterFrame, "grid" | "heap" | "visited">) => {
    frames.push({
      ...frame,
      grid: grid.map((row) => [...row]),
      heap: [...heap].sort(byHeapOrder).map(([time, row, col]) => [time, row, col]),
      visited: visitedCells.map(([row, col]) => [row, col]),
    });
  };

  push({
    kind: "start",
    phase: "initialize",
    title: "Initialize the min-heap",
    detail: n ? `Start at (0, 0) with water level grid[0][0] = ${grid[0][0]}.` : "The grid is empty.",
    activeLines: [7, 10, 12, 14],
    current: n ? [0, 0] : null,
    neighbor: null,
    time: n ? grid[0][0] : null,
    newTime: null,
    result: null,
  });

  while (heap.length) {
    heap.sort(byHeapOrder);
    const [time, row, col] = heap.shift()!;
    const current: Cell = [row, col];

    push({
      kind: "visit",
      phase: "pop",
      title: `Pop (${time}, ${row}, ${col})`,
      detail: `This is the lowest required water level currently in heap.`,
      activeLines: [16, 17],
      current,
      neighbor: null,
      time,
      newTime: null,
      result: null,
    });

    if (visited.has(cellKey(current))) {
      push({
        kind: "prune",
        phase: "skip",
        title: `Skip (${row}, ${col}): already visited`,
        detail: "This is an older heap entry. The code continues without exploring it again.",
        activeLines: [19, 20],
        current,
        neighbor: null,
        time,
        newTime: null,
        result: null,
      });
      continue;
    }

    visited.add(cellKey(current));
    visitedCells.push(current);
    push({
      kind: "build",
      phase: "visit",
      title: `Visit (${row}, ${col}) at water level ${time}`,
      detail: "The cell becomes finalized only when it is popped from heap for the first time.",
      activeLines: [22],
      current,
      neighbor: null,
      time,
      newTime: null,
      result: null,
    });

    if (row === n - 1 && col === n - 1) {
      push({
        kind: "done",
        phase: "target",
        title: "Reached the bottom-right cell",
        detail: `Return time = ${time}; this is the minimum water level needed to reach the goal.`,
        activeLines: [25, 26],
        current,
        neighbor: null,
        time,
        newTime: null,
        result: time,
      });
      return { frames };
    }

    push({
      kind: "visit",
      phase: "directions",
      title: `Explore four neighbors of (${row}, ${col})`,
      detail: "Try down, up, right, then left in the order written in directions.",
      activeLines: [28, 29, 30],
      current,
      neighbor: null,
      time,
      newTime: null,
      result: null,
    });

    for (const [dr, dc] of directions) {
      const neighbor: Cell = [row + dr, col + dc];
      const [nextRow, nextCol] = neighbor;
      const inBounds = nextRow >= 0 && nextRow < n && nextCol >= 0 && nextCol < n;
      const alreadyVisited = inBounds && visited.has(cellKey(neighbor));

      push({
        kind: inBounds && !alreadyVisited ? "visit" : "prune",
        phase: "bounds",
        title: `Check neighbor (${nextRow}, ${nextCol})`,
        detail: !inBounds ? "Out of bounds, so the if condition is false." : alreadyVisited ? "Already in visited, so do not push another candidate." : "In bounds and unvisited: calculate its required water level.",
        activeLines: [32, 33, 34, 35, 36],
        current,
        neighbor,
        time,
        newTime: null,
        result: null,
      });

      if (!inBounds || alreadyVisited) continue;

      const newTime = Math.max(time, grid[nextRow][nextCol]);
      push({
        kind: "visit",
        phase: "calculate",
        title: `new_time for (${nextRow}, ${nextCol}) is ${newTime}`,
        detail: `max(${time}, grid[${nextRow}][${nextCol}] = ${grid[nextRow][nextCol]}) = ${newTime}.`,
        activeLines: [38],
        current,
        neighbor,
        time,
        newTime,
        result: null,
      });

      heap.push([newTime, nextRow, nextCol]);
      push({
        kind: "build",
        phase: "push",
        title: `Push (${newTime}, ${nextRow}, ${nextCol}) to heap`,
        detail: "Keep this candidate in heap. If the cell is later visited through another entry, old entries will be skipped when popped.",
        activeLines: [40],
        current,
        neighbor,
        time,
        newTime,
        result: null,
      });
    }
  }

  push({
    kind: "done",
    phase: "done",
    title: "Heap is empty",
    detail: "No route reached the target.",
    activeLines: [16],
    current: null,
    neighbor: null,
    time: null,
    newTime: null,
    result: -1,
  });
  return { frames };
}
