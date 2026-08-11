import type { Cell, FrameKind } from "../../types";

export type WallsAndGatesFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  rooms: number[][];
  queue: Cell[];
  current: Cell | null;
  target: Cell | null;
  updated: Cell | null;
  result: number[][] | null;
};

const INF = 2147483647;
const directions: Cell[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export function createWallsAndGatesDryRun(roomsInput: number[][]): { frames: WallsAndGatesFrame[] } {
  const rooms = roomsInput.map((row) => [...row]);
  const queue: Cell[] = [];
  const frames: WallsAndGatesFrame[] = [];
  const rows = rooms.length;
  const cols = rooms[0]?.length ?? 0;
  const push = (frame: Omit<WallsAndGatesFrame, "rooms" | "queue">) => {
    frames.push({
      ...frame,
      rooms: rooms.map((row) => [...row]),
      queue: queue.map(([row, col]) => [row, col] as Cell),
    });
  };

  push({
    kind: "start",
    title: "Check rooms",
    detail: "Return immediately only when rooms is empty.",
    activeLines: [5],
    current: null,
    target: null,
    updated: null,
    result: null,
  });

  if (!rows || !cols) {
    push({
      kind: "done",
      title: "No rooms to fill",
      detail: "The input is empty, so the function returns.",
      activeLines: [5, 6],
      current: null,
      target: null,
      updated: null,
      result: rooms.map((row) => [...row]),
    });
    return { frames };
  }

  push({
    kind: "build",
    title: "Initialize grid and queue",
    detail: `m = ${rows}, n = ${cols}. The queue will start with every gate.`,
    activeLines: [8, 9],
    current: null,
    target: null,
    updated: null,
    result: null,
  });

  for (let i = 0; i < rows; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      push({
        kind: "visit",
        title: `Scan (${i}, ${j})`,
        detail: rooms[i][j] === 0 ? "This cell is a gate." : "This cell is not a gate.",
        activeLines: [11, 12, 13],
        current: [i, j],
        target: null,
        updated: null,
        result: null,
      });
      if (rooms[i][j] === 0) {
        queue.push([i, j]);
        push({
          kind: "build",
          title: `Enqueue gate (${i}, ${j})`,
          detail: "All gates are BFS sources, so they enter the queue at distance 0.",
          activeLines: [13, 14],
          current: [i, j],
          target: null,
          updated: null,
          result: null,
        });
      }
    }
  }

  push({
    kind: "build",
    title: "Set four directions",
    detail: "BFS can move down, up, right, or left.",
    activeLines: [16],
    current: null,
    target: null,
    updated: null,
    result: null,
  });

  while (queue.length) {
    const current = queue.shift()!;
    const [i, j] = current;
    push({
      kind: "visit",
      title: `Dequeue (${i}, ${j})`,
      detail: `This cell already has distance ${rooms[i][j]}; try to fill adjacent INF rooms.`,
      activeLines: [18, 19],
      current,
      target: null,
      updated: null,
      result: null,
    });

    for (const [di, dj] of directions) {
      const ni = i + di;
      const nj = j + dj;
      const target: Cell = [ni, nj];
      push({
        kind: "start",
        title: `Check neighbor (${ni}, ${nj})`,
        detail: `Compute ni = ${i} + ${di}, nj = ${j} + ${dj}.`,
        activeLines: [21, 22],
        current,
        target,
        updated: null,
        result: null,
      });

      const inside = ni >= 0 && ni < rows && nj >= 0 && nj < cols;
      if (!inside || rooms[ni][nj] !== INF) {
        const reason = !inside ? "It is outside the grid." : `rooms[${ni}][${nj}] is already ${rooms[ni][nj]}, not INF.`;
        push({
          kind: "prune",
          title: "Skip neighbor",
          detail: reason,
          activeLines: [24],
          current,
          target,
          updated: null,
          result: null,
        });
        continue;
      }

      rooms[ni][nj] = rooms[i][j] + 1;
      push({
        kind: "found",
        title: `Set room (${ni}, ${nj}) = ${rooms[ni][nj]}`,
        detail: `Its closest gate is one step from (${i}, ${j}).`,
        activeLines: [24, 25],
        current,
        target,
        updated: target,
        result: null,
      });

      queue.push(target);
      push({
        kind: "build",
        title: `Enqueue (${ni}, ${nj})`,
        detail: "This newly filled room can now expand the next BFS wave.",
        activeLines: [26],
        current,
        target,
        updated: target,
        result: null,
      });
    }
  }

  push({
    kind: "done",
    title: "All reachable rooms are filled",
    detail: "The queue is empty, so every room has its nearest-gate distance.",
    activeLines: [18],
    current: null,
    target: null,
    updated: null,
    result: rooms.map((row) => [...row]),
  });

  return { frames };
}
