import type { Cell, FrameKind } from "../../types";

export type RottingOrangesFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  grid: number[][];
  queue: Cell[];
  current: Cell | null;
  target: Cell | null;
  updated: Cell | null;
  fresh: number;
  minutes: number;
  levelSize: number | null;
  result: number | null;
};

const directions: Cell[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export function createRottingOrangesDryRun(gridInput: number[][]): { frames: RottingOrangesFrame[] } {
  const grid = gridInput.map((row) => [...row]);
  const queue: Cell[] = [];
  const frames: RottingOrangesFrame[] = [];
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  let fresh = 0;
  let minutes = 0;
  const push = (frame: Omit<RottingOrangesFrame, "grid" | "queue" | "fresh" | "minutes">) => {
    frames.push({
      ...frame,
      grid: grid.map((row) => [...row]),
      queue: queue.map(([row, col]) => [row, col] as Cell),
      fresh,
      minutes,
    });
  };

  push({
    kind: "start",
    title: "Initialize queue and fresh count",
    detail: `m = ${rows}, n = ${cols}. Scan every orange before BFS begins.`,
    activeLines: [5, 6, 7],
    current: null,
    target: null,
    updated: null,
    levelSize: null,
    result: null,
  });

  for (let i = 0; i < rows; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      const current: Cell = [i, j];
      push({
        kind: "visit",
        title: `Scan (${i}, ${j})`,
        detail: grid[i][j] === 2 ? "A rotten orange enters the source queue." : grid[i][j] === 1 ? "Count this fresh orange." : "This cell is empty.",
        activeLines: [9, 10, 11, 13],
        current,
        target: null,
        updated: null,
        levelSize: null,
        result: null,
      });
      if (grid[i][j] === 2) {
        queue.push(current);
        push({
          kind: "build",
          title: `Enqueue rotten orange (${i}, ${j})`,
          detail: "It can infect adjacent fresh oranges in minute 0.",
          activeLines: [11, 12],
          current,
          target: null,
          updated: null,
          levelSize: null,
          result: null,
        });
      } else if (grid[i][j] === 1) {
        fresh += 1;
        push({
          kind: "build",
          title: `fresh = ${fresh}`,
          detail: "This orange must eventually rot for the answer to be possible.",
          activeLines: [13, 14],
          current,
          target: null,
          updated: null,
          levelSize: null,
          result: null,
        });
      }
    }
  }

  push({
    kind: "build",
    title: "Set directions and minutes",
    detail: "A BFS level represents exactly one minute of rot spreading.",
    activeLines: [16, 17],
    current: null,
    target: null,
    updated: null,
    levelSize: null,
    result: null,
  });

  while (queue.length && fresh) {
    const levelSize = queue.length;
    push({
      kind: "start",
      title: `Minute ${minutes}: process ${levelSize} orange${levelSize === 1 ? "" : "s"}`,
      detail: "Only the oranges already in the queue may spread during this minute.",
      activeLines: [19, 20],
      current: null,
      target: null,
      updated: null,
      levelSize,
      result: null,
    });

    for (let index = 0; index < levelSize; index += 1) {
      const current = queue.shift()!;
      const [i, j] = current;
      push({
        kind: "visit",
        title: `Dequeue rotten orange (${i}, ${j})`,
        detail: "Try its four adjacent cells during the current BFS level.",
        activeLines: [20, 21],
        current,
        target: null,
        updated: null,
        levelSize,
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
          activeLines: [23, 24],
          current,
          target,
          updated: null,
          levelSize,
          result: null,
        });

        const inside = ni >= 0 && ni < rows && nj >= 0 && nj < cols;
        if (!inside || grid[ni][nj] !== 1) {
          const reason = !inside ? "It is outside the grid." : grid[ni][nj] === 0 ? "It is empty." : "It is already rotten.";
          push({
            kind: "prune",
            title: "No fresh orange to infect",
            detail: reason,
            activeLines: [26],
            current,
            target,
            updated: null,
            levelSize,
            result: null,
          });
          continue;
        }

        grid[ni][nj] = 2;
        fresh -= 1;
        push({
          kind: "found",
          title: `Rot orange (${ni}, ${nj})`,
          detail: `Set it to 2 and decrement fresh to ${fresh}.`,
          activeLines: [26, 27, 28],
          current,
          target,
          updated: target,
          levelSize,
          result: null,
        });

        queue.push(target);
        push({
          kind: "build",
          title: `Enqueue (${ni}, ${nj}) for the next minute`,
          detail: "It will spread only after this entire BFS level is complete.",
          activeLines: [29],
          current,
          target,
          updated: target,
          levelSize,
          result: null,
        });
      }
    }

    minutes += 1;
    push({
      kind: "build",
      title: `Advance to minute ${minutes}`,
      detail: "The current BFS level is finished.",
      activeLines: [31],
      current: null,
      target: null,
      updated: null,
      levelSize,
      result: null,
    });
  }

  const result = fresh === 0 ? minutes : -1;
  push({
    kind: "done",
    title: result === -1 ? "Fresh oranges remain" : `Return ${minutes} minute${minutes === 1 ? "" : "s"}`,
    detail: result === -1 ? `${fresh} fresh orange${fresh === 1 ? "" : "s"} cannot be reached.` : "Every fresh orange has become rotten.",
    activeLines: [33],
    current: null,
    target: null,
    updated: null,
    levelSize: null,
    result,
  });

  return { frames };
}
