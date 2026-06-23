import type { Cell, FrameKind } from "../../types";

export type TriangleFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  triangle: number[][];
  current: Cell | null;
  leftChild: Cell | null;
  rightChild: Cell | null;
  cache: Record<string, number>;
  stack: string[];
  result: number | null;
};

const keyOf = (i: number, j: number) => `${i},${j}`;

export function createTriangleDryRun(triangle: number[][]): { frames: TriangleFrame[] } {
  const frames: TriangleFrame[] = [];
  const cache = new Map<string, number>();
  const stack: string[] = [];

  const push = (frame: Omit<TriangleFrame, "triangle" | "cache" | "stack">) => {
    frames.push({
      ...frame,
      triangle: triangle.map((row) => [...row]),
      cache: Object.fromEntries(cache.entries()),
      stack: [...stack],
    });
  };

  push({
    kind: "start",
    title: "Start dfs(0, 0)",
    detail: "Use lru_cache so each cell is solved once.",
    activeLines: [7, 17],
    current: [0, 0],
    leftChild: null,
    rightChild: null,
    result: null,
  });

  const result = dfs(0, 0);

  push({
    kind: "done",
    title: "Return answer",
    detail: `dfs(0, 0) returns ${result}.`,
    activeLines: [17],
    current: [0, 0],
    leftChild: null,
    rightChild: null,
    result,
  });

  return { frames };

  function dfs(i: number, j: number): number {
    const key = keyOf(i, j);
    stack.push(`dfs(${i}, ${j})`);
    push({
      kind: "visit",
      title: `Enter dfs(${i}, ${j})`,
      detail: `Current value is triangle[${i}][${j}] = ${triangle[i][j]}.`,
      activeLines: [8, 9],
      current: [i, j],
      leftChild: null,
      rightChild: null,
      result: null,
    });

    if (cache.has(key)) {
      const cached = cache.get(key)!;
      push({
        kind: "found",
        title: "Cache hit",
        detail: `dfs(${i}, ${j}) is already cached as ${cached}.`,
        activeLines: [7, 8],
        current: [i, j],
        leftChild: null,
        rightChild: null,
        result: cached,
      });
      stack.pop();
      return cached;
    }

    if (i === triangle.length - 1) {
      const value = triangle[i][j];
      cache.set(key, value);
      push({
        kind: "found",
        title: "Bottom row",
        detail: `At the last row, return triangle[${i}][${j}] = ${value}.`,
        activeLines: [9, 10],
        current: [i, j],
        leftChild: null,
        rightChild: null,
        result: value,
      });
      stack.pop();
      return value;
    }

    push({
      kind: "start",
      title: "Go left child",
      detail: `Compute left = dfs(${i + 1}, ${j}).`,
      activeLines: [12],
      current: [i, j],
      leftChild: [i + 1, j],
      rightChild: null,
      result: null,
    });
    const left = dfs(i + 1, j);

    push({
      kind: "start",
      title: "Go right child",
      detail: `Compute right = dfs(${i + 1}, ${j + 1}).`,
      activeLines: [13],
      current: [i, j],
      leftChild: [i + 1, j],
      rightChild: [i + 1, j + 1],
      result: null,
    });
    const right = dfs(i + 1, j + 1);

    const value = triangle[i][j] + Math.min(left, right);
    cache.set(key, value);
    push({
      kind: "build",
      title: `Cache dfs(${i}, ${j}) = ${value}`,
      detail: `${triangle[i][j]} + min(${left}, ${right}) = ${value}.`,
      activeLines: [15],
      current: [i, j],
      leftChild: [i + 1, j],
      rightChild: [i + 1, j + 1],
      result: value,
    });

    stack.pop();
    return value;
  }
}
