import type { FrameKind } from "../../shared/types";

export type Point = {
  id: number;
  x: number;
  y: number;
};

export type MstCandidate = {
  cost: number;
  point: number;
  from: number | null;
};

export type MstEdge = {
  from: number;
  to: number;
  cost: number;
};

export type MinCostConnectPointsFrame = {
  kind: FrameKind;
  phase: "initialize" | "pop" | "skip" | "join" | "explore" | "calculate" | "push" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  points: Point[];
  heap: MstCandidate[];
  visited: number[];
  mstEdges: MstEdge[];
  current: number | null;
  candidate: number | null;
  candidateFrom: number | null;
  candidateCost: number | null;
  res: number;
  result: number | null;
};

type PointInput = [number, number];

function isPoint(point: number[]): point is PointInput {
  return point.length === 2 && point.every(Number.isFinite);
}

const byHeapOrder = (left: MstCandidate, right: MstCandidate) =>
  left.cost - right.cost || left.point - right.point || (left.from ?? -1) - (right.from ?? -1);

export function createMinCostConnectPointsDryRun(pointsInput: number[][]): { frames: MinCostConnectPointsFrame[] } {
  const points = pointsInput.filter(isPoint).map(([x, y], id) => ({ id, x, y }));
  const n = points.length;
  const heap: MstCandidate[] = n ? [{ cost: 0, point: 0, from: null }] : [];
  const visited = new Set<number>();
  const mstEdges: MstEdge[] = [];
  const frames: MinCostConnectPointsFrame[] = [];
  let res = 0;

  const push = (frame: Omit<MinCostConnectPointsFrame, "points" | "heap" | "visited" | "mstEdges" | "res">) => {
    frames.push({
      ...frame,
      points: points.map((point) => ({ ...point })),
      heap: [...heap].sort(byHeapOrder).map((candidate) => ({ ...candidate })),
      visited: [...visited],
      mstEdges: mstEdges.map((edge) => ({ ...edge })),
      res,
    });
  };

  push({
    kind: "start",
    phase: "initialize",
    title: "Initialize Prim's min-heap",
    detail: n ? "Start from P0: heap = [(0, 0)], visited = {}, res = 0." : "There are no points to connect.",
    activeLines: [7, 10, 12, 13],
    current: null,
    candidate: n ? 0 : null,
    candidateFrom: null,
    candidateCost: n ? 0 : null,
    result: null,
  });

  while (visited.size < n) {
    heap.sort(byHeapOrder);
    const next = heap.shift();
    if (!next) break;

    push({
      kind: "visit",
      phase: "pop",
      title: `Pop (${next.cost}, P${next.point}) from heap`,
      detail: `This is the cheapest candidate currently available${next.from === null ? "; P0 starts the MST with cost 0." : ` from P${next.from}.`}`,
      activeLines: [15, 17],
      current: next.point,
      candidate: next.point,
      candidateFrom: next.from,
      candidateCost: next.cost,
      result: null,
    });

    if (visited.has(next.point)) {
      push({
        kind: "prune",
        phase: "skip",
        title: `P${next.point} is already in the MST`,
        detail: `(${next.cost}, P${next.point}) is an old candidate. continue keeps res = ${res} unchanged.`,
        activeLines: [20, 21],
        current: next.point,
        candidate: next.point,
        candidateFrom: next.from,
        candidateCost: next.cost,
        result: null,
      });
      continue;
    }

    visited.add(next.point);
    res += next.cost;
    if (next.from !== null) mstEdges.push({ from: next.from, to: next.point, cost: next.cost });
    push({
      kind: "build",
      phase: "join",
      title: `Add P${next.point} to the MST`,
      detail: `visited gains P${next.point}; res += ${next.cost}, so res = ${res}.`,
      activeLines: [24, 25],
      current: next.point,
      candidate: next.point,
      candidateFrom: next.from,
      candidateCost: next.cost,
      result: null,
    });

    const current = points[next.point];
    push({
      kind: "visit",
      phase: "explore",
      title: `Explore connections from P${next.point}`,
      detail: `x1, y1 = (${current.x}, ${current.y}). Try every point that is not in visited.`,
      activeLines: [27, 30],
      current: next.point,
      candidate: null,
      candidateFrom: null,
      candidateCost: null,
      result: null,
    });

    for (const neighbor of points) {
      if (visited.has(neighbor.id)) {
        push({
          kind: "prune",
          phase: "explore",
          title: `Skip P${neighbor.id}: already visited`,
          detail: `P${neighbor.id} is already in the MST, so the if condition is false and no candidate is pushed.`,
          activeLines: [30, 31],
          current: next.point,
          candidate: neighbor.id,
          candidateFrom: next.point,
          candidateCost: null,
          result: null,
        });
        continue;
      }

      const newCost = Math.abs(current.x - neighbor.x) + Math.abs(current.y - neighbor.y);
      push({
        kind: "visit",
        phase: "calculate",
        title: `Calculate P${next.point} -> P${neighbor.id}`,
        detail: `|${current.x} - ${neighbor.x}| + |${current.y} - ${neighbor.y}| = ${newCost}.`,
        activeLines: [32, 35],
        current: next.point,
        candidate: neighbor.id,
        candidateFrom: next.point,
        candidateCost: newCost,
        result: null,
      });

      heap.push({ cost: newCost, point: neighbor.id, from: next.point });
      push({
        kind: "build",
        phase: "push",
        title: `Push (${newCost}, P${neighbor.id}) to heap`,
        detail: `This candidate is kept even if a cheaper path to P${neighbor.id} appears later; old entries will be skipped after P${neighbor.id} joins the MST.`,
        activeLines: [37],
        current: next.point,
        candidate: neighbor.id,
        candidateFrom: next.point,
        candidateCost: newCost,
        result: null,
      });
    }
  }

  push({
    kind: "done",
    phase: "done",
    title: "All points are in the MST",
    detail: `visited contains ${visited.size} points, so return the total minimum cost ${res}.`,
    activeLines: [39],
    current: null,
    candidate: null,
    candidateFrom: null,
    candidateCost: null,
    result: res,
  });

  return { frames };
}
