import type { Cell, FrameKind } from "../../shared/types";
import { directions } from "./data";

export type WordSearchExistFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  currentCell: Cell | null;
  targetCell: Cell | null;
  visited: Cell[];
  path: string;
  index: number;
  stack: string[];
  result: boolean | null;
  expectedChar: string | null;
};

export function createWordSearchExistDryRun(board: string[][], word: string): { frames: WordSearchExistFrame[] } {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const frames: WordSearchExistFrame[] = [];
  const visited = new Set<string>();
  const stack: string[] = [];

  const pushFrame = (frame: Omit<WordSearchExistFrame, "visited" | "stack"> & { stack?: string[] }) => {
    frames.push({
      ...frame,
      visited: [...visited].map(parseCellKey),
      stack: frame.stack ?? [...stack],
    });
  };

  pushFrame({
    kind: "start",
    title: "Initialize",
    detail: `Board is ${rows} x ${cols}. Target word is "${word}".`,
    activeLines: [5, 6, 8],
    currentCell: null,
    targetCell: null,
    path: "",
    index: 0,
    result: null,
    expectedChar: word[0] ?? null,
  });

  for (let i = 0; i < rows; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      pushFrame({
        kind: "start",
        title: `Try start (${i}, ${j})`,
        detail: `Run dfs(${i}, ${j}, 0) from this board cell.`,
        activeLines: [36, 37, 38],
        currentCell: null,
        targetCell: [i, j],
        path: "",
        index: 0,
        result: null,
        expectedChar: word[0] ?? null,
        stack: [`dfs(${i}, ${j}, 0)`],
      });

      if (dfs(i, j, 0, "")) {
        pushFrame({
          kind: "done",
          title: "Return True",
          detail: `A complete path formed "${word}", so exist returns True immediately.`,
          activeLines: [38, 39],
          currentCell: null,
          targetCell: [i, j],
          path: word,
          index: word.length,
          result: true,
          expectedChar: null,
          stack: ["return True"],
        });
        return { frames };
      }
    }
  }

  pushFrame({
    kind: "done",
    title: "Return False",
    detail: `Every start cell has been tried, and no path formed "${word}".`,
    activeLines: [41],
    currentCell: null,
    targetCell: null,
    path: "",
    index: 0,
    result: false,
    expectedChar: word[0] ?? null,
    stack: ["return False"],
  });

  return { frames };

  function dfs(i: number, j: number, index: number, path: string): boolean {
    const label = `dfs(${i}, ${j}, ${index})`;
    stack.push(label);

    pushFrame({
      kind: "visit",
      title: `Enter ${label}`,
      detail: `Need word[${index}]${word[index] ? ` = "${word[index]}"` : ""}. Current path is "${path || "empty"}".`,
      activeLines: [10, 11],
      currentCell: isInside(i, j) ? [i, j] : null,
      targetCell: [i, j],
      path,
      index,
      result: null,
      expectedChar: word[index] ?? null,
    });

    if (index === word.length) {
      pushFrame({
        kind: "found",
        title: "Matched full word",
        detail: `index == len(word), so the path "${path}" is complete.`,
        activeLines: [11, 12],
        currentCell: null,
        targetCell: null,
        path,
        index,
        result: true,
        expectedChar: null,
      });
      stack.pop();
      return true;
    }

    if (!isInside(i, j)) {
      pushFrame({
        kind: "prune",
        title: "Prune: boundary",
        detail: `(${i}, ${j}) is outside the board.`,
        activeLines: [14, 15],
        currentCell: null,
        targetCell: [i, j],
        path,
        index,
        result: false,
        expectedChar: word[index] ?? null,
      });
      stack.pop();
      return false;
    }

    const key = cellKey([i, j]);
    if (visited.has(key)) {
      pushFrame({
        kind: "prune",
        title: "Prune: already visited",
        detail: `Cell (${i}, ${j}) is already used in the current path.`,
        activeLines: [17, 18],
        currentCell: [i, j],
        targetCell: [i, j],
        path,
        index,
        result: false,
        expectedChar: word[index] ?? null,
      });
      stack.pop();
      return false;
    }

    const ch = board[i][j];
    if (ch !== word[index]) {
      pushFrame({
        kind: "prune",
        title: "Prune: character mismatch",
        detail: `board[${i}][${j}] is "${ch}", but word[${index}] is "${word[index]}".`,
        activeLines: [20, 21],
        currentCell: [i, j],
        targetCell: [i, j],
        path,
        index,
        result: false,
        expectedChar: word[index] ?? null,
      });
      stack.pop();
      return false;
    }

    visited.add(key);
    const nextPath = path + ch;
    pushFrame({
      kind: "visit",
      title: `Take "${ch}"`,
      detail: `Mark (${i}, ${j}) as visited and advance to index ${index + 1}.`,
      activeLines: [20, 23],
      currentCell: [i, j],
      targetCell: [i, j],
      path: nextPath,
      index: index + 1,
      result: null,
      expectedChar: word[index + 1] ?? null,
    });

    let found = false;
    for (const [dr, dc, name, line] of directions) {
      const nextI = i + dr;
      const nextJ = j + dc;
      pushFrame({
        kind: "start",
        title: `Try ${name}`,
        detail: `Because of the OR chain, dfs tries ${name} next: (${nextI}, ${nextJ}, ${index + 1}).`,
        activeLines: [24, line],
        currentCell: [i, j],
        targetCell: [nextI, nextJ],
        path: nextPath,
        index: index + 1,
        result: null,
        expectedChar: word[index + 1] ?? null,
      });

      found = dfs(nextI, nextJ, index + 1, nextPath);
      if (found) {
        pushFrame({
          kind: "found",
          title: "Short-circuit True",
          detail: `${name} returned True, so the remaining OR branches are skipped.`,
          activeLines: [24, line, 30],
          currentCell: [i, j],
          targetCell: [nextI, nextJ],
          path: nextPath,
          index: index + 1,
          result: true,
          expectedChar: word[index + 1] ?? null,
        });
        break;
      }
    }

    visited.delete(key);
    pushFrame({
      kind: "backtrack",
      title: `Backtrack from (${i}, ${j})`,
      detail: `Set visited[${i}][${j}] back to False, then return ${found ? "True" : "False"}.`,
      activeLines: [32, 34],
      currentCell: [i, j],
      targetCell: [i, j],
      path,
      index,
      result: found,
      expectedChar: word[index] ?? null,
    });

    stack.pop();
    return found;
  }

  function isInside(i: number, j: number): boolean {
    return i >= 0 && i < rows && j >= 0 && j < cols;
  }
}

export function cellKey(cell: Cell): string {
  return `${cell[0]}-${cell[1]}`;
}

function parseCellKey(key: string): Cell {
  const [row, col] = key.split("-").map(Number);
  return [row, col];
}
