import type { Cell, FrameKind } from "../../shared/types";

export type SpiralDirection = "right" | "down" | "left" | "up" | null;

export type SpiralMatrixFrame = {
  kind: FrameKind;
  phase: "initialize" | "visit" | "shrink" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  matrix: number[][];
  top: number;
  bottom: number;
  left: number;
  right: number;
  current: Cell | null;
  direction: SpiralDirection;
  order: Cell[];
  result: number[] | null;
};

export function createSpiralMatrixDryRun(matrix: number[][]): { frames: SpiralMatrixFrame[] } {
  const frames: SpiralMatrixFrame[] = [];
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  let top = 0;
  let bottom = rows - 1;
  let left = 0;
  let right = cols - 1;
  const order: Cell[] = [];
  const result: number[] = [];
  const snapshot = (frame: Omit<SpiralMatrixFrame, "matrix" | "top" | "bottom" | "left" | "right" | "order">) => {
    frames.push({ ...frame, matrix: matrix.map((row) => [...row]), top, bottom, left, right, order: order.map(([row, col]) => [row, col]), });
  };
  const visit = (row: number, col: number, direction: Exclude<SpiralDirection, null>, activeLines: number[]) => {
    order.push([row, col]);
    result.push(matrix[row]![col]!);
    snapshot({ kind: "visit", phase: "visit", title: "Read " + matrix[row]![col] + " while moving " + direction, detail: "Append matrix[" + row + "][" + col + "] = " + matrix[row]![col] + ". The spiral output now has " + result.length + " values.", activeLines, current: [row, col], direction, result: null });
  };

  snapshot({ kind: "start", phase: "initialize", title: "Set the outer rectangle boundaries", detail: "top, bottom, left, and right describe the unvisited rectangle. Each loop walks its four sides clockwise.", activeLines: [3, 4, 5, 6], current: null, direction: null, result: null });

  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col += 1) visit(top, col, "right", [9, 10]);
    top += 1;
    snapshot({ kind: "build", phase: "shrink", title: "Move top boundary to row " + top, detail: "The old top row is fully read, so exclude it from the remaining rectangle.", activeLines: [11], current: null, direction: "right", result: null });

    for (let row = top; row <= bottom; row += 1) visit(row, right, "down", [13, 14]);
    right -= 1;
    snapshot({ kind: "build", phase: "shrink", title: "Move right boundary to column " + right, detail: "The old right column is fully read, so shrink the rectangle from the right.", activeLines: [15], current: null, direction: "down", result: null });

    if (top <= bottom) {
      for (let col = right; col >= left; col -= 1) visit(bottom, col, "left", [17, 18]);
      bottom -= 1;
      snapshot({ kind: "build", phase: "shrink", title: "Move bottom boundary to row " + bottom, detail: "The old bottom row is fully read in reverse, so shrink the rectangle upward.", activeLines: [19], current: null, direction: "left", result: null });
    }

    if (left <= right) {
      for (let row = bottom; row >= top; row -= 1) visit(row, left, "up", [21, 22]);
      left += 1;
      snapshot({ kind: "build", phase: "shrink", title: "Move left boundary to column " + left, detail: "The old left column is fully read upward. The next loop begins at the inner rectangle.", activeLines: [23], current: null, direction: "up", result: null });
    }
  }

  snapshot({ kind: "done", phase: "done", title: "Return the clockwise spiral", detail: "No unvisited rectangle remains. Return the " + result.length + " values in their visited order.", activeLines: [25], current: null, direction: null, result: [...result] });
  return { frames };
}
