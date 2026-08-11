import type { FrameKind } from "../../shared/types";

export type SqrtFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  x: number;
  left: number;
  right: number;
  mid: number | null;
  midSquare: number | null;
  trueMax: number;
  falseMin: number;
  result: number | null;
  relation: string;
  movedPointer: "left" | "right" | null;
};

export function createSqrtDryRun(x: number): { frames: SqrtFrame[] } {
  const frames: SqrtFrame[] = [];
  let left = 0;
  let right = x;
  let trueMax = -1;
  let falseMin = x + 1;

  const push = (frame: Omit<SqrtFrame, "x" | "left" | "right" | "trueMax" | "falseMin" | "relation">) => {
    frames.push({
      ...frame,
      x,
      left,
      right,
      trueMax,
      falseMin,
      relation: trueMax >= 0 && falseMin <= x + 1 ? `${trueMax}^2 <= ${x} < ${falseMin}^2` : "boundary not known yet",
    });
  };

  push({
    kind: "start",
    title: "Initialize search range",
    detail: `left = 0, right = ${x}. We search the last number whose square is <= x.`,
    activeLines: [3],
    mid: null,
    midSquare: null,
    result: null,
    movedPointer: null,
  });

  while (left <= right) {
    push({
      kind: "visit",
      title: "Check loop condition",
      detail: `Continue because left <= right: ${left} <= ${right}.`,
      activeLines: [5],
      mid: null,
      midSquare: null,
      result: null,
      movedPointer: null,
    });

    const mid = left + Math.floor((right - left) / 2);
    const midSquare = mid * mid;
    push({
      kind: "visit",
      title: `Compute mid = ${mid}`,
      detail: `${mid} * ${mid} = ${midSquare}. Now decide which side mid belongs to.`,
      activeLines: [6],
      mid,
      midSquare,
      result: null,
      movedPointer: null,
    });

    if (midSquare <= x) {
      trueMax = Math.max(trueMax, mid);
      left = mid + 1;
      push({
        kind: "build",
        title: "mid is in the True region",
        detail: `${midSquare} <= ${x}, so ${mid} is legal. Move left to ${left} to search for a larger legal value.`,
        activeLines: [8, 9],
        mid,
        midSquare,
        result: null,
        movedPointer: "left",
      });
    } else {
      falseMin = Math.min(falseMin, mid);
      right = mid - 1;
      push({
        kind: "prune",
        title: "mid is in the False region",
        detail: `${midSquare} > ${x}, so ${mid} is too large. Move right to ${right} to search smaller values.`,
        activeLines: [10, 11],
        mid,
        midSquare,
        result: null,
        movedPointer: "right",
      });
    }
  }

  trueMax = right;
  falseMin = left;
  push({
    kind: "done",
    title: "Pointers crossed",
    detail: `Loop stops with left = ${left}, right = ${right}. right is the last legal integer, so return ${right}.`,
    activeLines: [5, 13],
    mid: null,
    midSquare: null,
    result: right,
    movedPointer: null,
  });

  return { frames };
}
