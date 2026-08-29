import type { FrameKind } from "../../shared/types";

export type LargestRectangleFrame = {
  kind: FrameKind;
  phase: "initialize" | "scan" | "settle" | "push" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  index: number | null;
  currentHeight: number | null;
  height: number | null;
  width: number | null;
  area: number | null;
  range: [number, number] | null;
  maxArea: number;
  stack: number[];
  result: number | null;
};

export function createLargestRectangleDryRun(heights: number[]): { frames: LargestRectangleFrame[] } {
  const stack: number[] = [];
  const frames: LargestRectangleFrame[] = [];
  let maxArea = 0;
  const snapshot = (frame: Omit<LargestRectangleFrame, "stack" | "maxArea">) => frames.push({ ...frame, stack: [...stack], maxArea });

  snapshot({ kind: "start", phase: "initialize", title: "Start with an empty index stack", detail: "Indices on the stack always point to nondecreasing heights.", activeLines: [2, 3], index: null, currentHeight: null, height: null, width: null, area: null, range: null, result: null });

  for (let index = 0; index <= heights.length; index += 1) {
    const currentHeight = index === heights.length ? 0 : heights[index]!;
    snapshot({ kind: "visit", phase: "scan", title: index === heights.length ? "Append a zero-height sentinel" : `Scan height ${currentHeight} at index ${index}`, detail: index === heights.length ? "The sentinel is smaller than every remaining bar, so it flushes the stack." : "A lower current height means some previous rectangles must end here.", activeLines: [4, 5], index: index === heights.length ? null : index, currentHeight, height: null, width: null, area: null, range: null, result: null });

    while (stack.length && heights[stack[stack.length - 1]!]! > currentHeight) {
      const poppedIndex = stack.pop()!;
      const height = heights[poppedIndex]!;
      const leftBoundary = stack.length ? stack[stack.length - 1]! : -1;
      const width = index - leftBoundary - 1;
      const area = height * width;
      maxArea = Math.max(maxArea, area);
      snapshot({ kind: "build", phase: "settle", title: `Settle height ${height}: ${height} x ${width} = ${area}`, detail: `The rectangle spans indices ${leftBoundary + 1} through ${index - 1}. maxArea = ${maxArea}.`, activeLines: [6, 7, 8, 9], index: index === heights.length ? null : index, currentHeight, height, width, area, range: [leftBoundary + 1, index - 1], result: null });
    }

    if (index < heights.length) {
      stack.push(index);
      snapshot({ kind: "found", phase: "push", title: `Push index ${index}`, detail: `Height ${currentHeight} may extend farther right, so keep its index on the stack.`, activeLines: [10, 11], index, currentHeight, height: null, width: null, area: null, range: null, result: null });
    }
  }

  snapshot({ kind: "done", phase: "done", title: "Return the largest area", detail: `Every possible limiting height has been settled. The largest rectangle area is ${maxArea}.`, activeLines: [12], index: null, currentHeight: null, height: null, width: null, area: null, range: null, result: maxArea });
  return { frames };
}
