import type { Cell, FrameKind } from "../../types";

export type OceanPhase = "pacific" | "atlantic" | "collect" | "done";

export type PacificAtlanticFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  pacific: boolean[][];
  atlantic: boolean[][];
  phase: OceanPhase;
  current: Cell | null;
  target: Cell | null;
  stack: Cell[];
  answer: Cell[];
  result: Cell[] | null;
};

const directions: Cell[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export function createPacificAtlanticDryRun(heights: number[][]): { frames: PacificAtlanticFrame[] } {
  const rows = heights.length;
  const cols = heights[0]?.length ?? 0;
  const pacific = Array.from({ length: rows }, () => Array(cols).fill(false));
  const atlantic = Array.from({ length: rows }, () => Array(cols).fill(false));
  const stack: Cell[] = [];
  const answer: Cell[] = [];
  const frames: PacificAtlanticFrame[] = [];
  const push = (frame: Omit<PacificAtlanticFrame, "pacific" | "atlantic" | "stack" | "answer">) => {
    frames.push({
      ...frame,
      pacific: pacific.map((row) => [...row]),
      atlantic: atlantic.map((row) => [...row]),
      stack: stack.map(([row, col]) => [row, col] as Cell),
      answer: answer.map(([row, col]) => [row, col] as Cell),
    });
  };

  push({
    kind: "start",
    title: "Initialize two reachability grids",
    detail: `m = ${rows}, n = ${cols}. Search inward from Pacific and Atlantic edges.`,
    activeLines: [3, 5, 6],
    phase: "pacific",
    current: null,
    target: null,
    result: null,
  });

  if (!rows || !cols) {
    push({
      kind: "done",
      title: "No heights to explore",
      detail: "The grid is empty, so the answer is empty.",
      activeLines: [35],
      phase: "done",
      current: null,
      target: null,
      result: [],
    });
    return { frames };
  }

  function dfs(i: number, j: number, visited: boolean[][], phase: "pacific" | "atlantic") {
    const current: Cell = [i, j];
    stack.push(current);
    visited[i][j] = true;
    push({
      kind: "visit",
      title: `${phase === "pacific" ? "Pacific" : "Atlantic"} DFS enters (${i}, ${j})`,
      detail: `Mark height ${heights[i][j]} as reachable from the ${phase} edge.`,
      activeLines: [8, 9],
      phase,
      current,
      target: null,
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
        activeLines: [11, 12],
        phase,
        current,
        target,
        result: null,
      });

      const inside = ni >= 0 && ni < rows && nj >= 0 && nj < cols;
      const canClimb = inside && !visited[ni][nj] && heights[ni][nj] >= heights[i][j];
      if (!canClimb) {
        let reason = "It is outside the grid.";
        if (inside && visited[ni][nj]) reason = "This ocean has already reached it.";
        if (inside && !visited[ni][nj] && heights[ni][nj] < heights[i][j]) reason = `${heights[ni][nj]} is lower than ${heights[i][j]}, so reverse flow cannot climb there.`;
        push({
          kind: "prune",
          title: "Do not recurse",
          detail: reason,
          activeLines: [14, 15],
          phase,
          current,
          target,
          result: null,
        });
        continue;
      }

      push({
        kind: "build",
        title: `Recurse to (${ni}, ${nj})`,
        detail: `${heights[ni][nj]} >= ${heights[i][j]}, so this neighbor can reach the same ocean.`,
        activeLines: [15, 16],
        phase,
        current,
        target,
        result: null,
      });
      dfs(ni, nj, visited, phase);
    }

    push({
      kind: "backtrack",
      title: `Return from DFS (${i}, ${j})`,
      detail: "All four directions have been considered; return to the previous recursive call.",
      activeLines: [11],
      phase,
      current,
      target: null,
      result: null,
    });
    stack.pop();
  }

  for (let i = 0; i < rows; i += 1) {
    push({
      kind: "start",
      title: `Pacific edge source (${i}, 0)`,
      detail: "Start a reverse-flow DFS from the left edge.",
      activeLines: [19, 20],
      phase: "pacific",
      current: [i, 0],
      target: null,
      result: null,
    });
    dfs(i, 0, pacific, "pacific");

    push({
      kind: "start",
      title: `Atlantic edge source (${i}, ${cols - 1})`,
      detail: "Start a reverse-flow DFS from the right edge.",
      activeLines: [19, 21],
      phase: "atlantic",
      current: [i, cols - 1],
      target: null,
      result: null,
    });
    dfs(i, cols - 1, atlantic, "atlantic");
  }

  for (let j = 0; j < cols; j += 1) {
    push({
      kind: "start",
      title: `Pacific edge source (0, ${j})`,
      detail: "Start a reverse-flow DFS from the top edge.",
      activeLines: [23, 24],
      phase: "pacific",
      current: [0, j],
      target: null,
      result: null,
    });
    dfs(0, j, pacific, "pacific");

    push({
      kind: "start",
      title: `Atlantic edge source (${rows - 1}, ${j})`,
      detail: "Start a reverse-flow DFS from the bottom edge.",
      activeLines: [23, 25],
      phase: "atlantic",
      current: [rows - 1, j],
      target: null,
      result: null,
    });
    dfs(rows - 1, j, atlantic, "atlantic");
  }

  push({
    kind: "build",
    title: "Initialize answer",
    detail: "Now intersect the Pacific and Atlantic reachability grids.",
    activeLines: [28],
    phase: "collect",
    current: null,
    target: null,
    result: null,
  });

  for (let i = 0; i < rows; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      const current: Cell = [i, j];
      const reachesBoth = pacific[i][j] && atlantic[i][j];
      push({
        kind: reachesBoth ? "visit" : "prune",
        title: reachesBoth ? `Both oceans reach (${i}, ${j})` : `Check (${i}, ${j})`,
        detail: reachesBoth ? "Both visited grids are true, so add this coordinate." : "At least one ocean cannot reach this cell.",
        activeLines: [30, 31, 32],
        phase: "collect",
        current,
        target: null,
        result: null,
      });
      if (reachesBoth) {
        answer.push(current);
        push({
          kind: "found",
          title: `Append [${i}, ${j}]`,
          detail: "This height can flow to both the Pacific and Atlantic oceans.",
          activeLines: [32, 33],
          phase: "collect",
          current,
          target: null,
          result: null,
        });
      }
    }
  }

  const result = answer.map(([row, col]) => [row, col] as Cell);
  push({
    kind: "done",
    title: `Return ${answer.length} cells`,
    detail: "The answer contains exactly the intersection of the two ocean reachability grids.",
    activeLines: [35],
    phase: "done",
    current: null,
    target: null,
    result,
  });

  return { frames };
}
