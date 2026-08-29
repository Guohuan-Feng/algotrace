import { describe, expect, test } from "vitest";
import { createPermutationsIiDryRun } from "./dryRun";

describe("Permutations II dry run", () => {
  test("uses the prior duplicate guard to produce each unique permutation once", () => {
    const { frames } = createPermutationsIiDryRun([1, 1, 2]);
    const last = frames[frames.length - 1]!;

    expect(last.result).toEqual([[1, 1, 2], [1, 2, 1], [2, 1, 1]]);
  });
});
