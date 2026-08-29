import { describe, expect, test } from "vitest";
import { createNQueensDryRun } from "./dryRun";

describe("N-Queens dry run", () => {
  test("builds both valid four-queen boards while backtracking rejected columns", () => {
    const { frames } = createNQueensDryRun(4);
    const last = frames[frames.length - 1]!;

    expect(last.result).toEqual([
      [".Q..", "...Q", "Q...", "..Q."],
      ["..Q.", "Q...", "...Q", ".Q.."],
    ]);
    expect(last.solutions).toHaveLength(2);
  });
});
