import { describe, expect, test } from "vitest";
import { createValidSudokuDryRun } from "./dryRun";

const validBoard = [
  ["5", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"],
];

describe("Valid Sudoku dry run", () => {
  test("accepts LeetCode example 1", () => {
    const run = createValidSudokuDryRun(validBoard);

    expect(run.frames[run.frames.length - 1]?.result).toBe(true);
  });

  test("rejects LeetCode example 2 when the first column repeats 8", () => {
    const board = validBoard.map((row) => [...row]);
    board[0]![0] = "8";
    const run = createValidSudokuDryRun(board);

    expect(run.frames[run.frames.length - 1]?.result).toBe(false);
  });
});
