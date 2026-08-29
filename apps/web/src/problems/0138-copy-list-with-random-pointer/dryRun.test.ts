import { describe, expect, test } from "vitest";
import { createCopyRandomListDryRun } from "./dryRun";

describe("Copy List with Random Pointer dry run", () => {
  test("weaves, assigns random pointers, and detaches the official first example", () => {
    const input = [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]] as Array<[number, number | null]>;
    const { frames } = createCopyRandomListDryRun(input);
    const done = frames[frames.length - 1];

    expect(done?.result).toEqual(input);
    expect(done?.originalNext).toEqual({ "o-0": "o-1", "o-1": "o-2", "o-2": "o-3", "o-3": "o-4", "o-4": null });
    expect(done?.copyRandom).toEqual({ "c-0": null, "c-1": "c-0", "c-2": "c-4", "c-3": "c-2", "c-4": "c-0" });
  });

  test("preserves a self-random pointer in the second official example", () => {
    const { frames } = createCopyRandomListDryRun([[1, 1], [2, 1]]);

    expect(frames[frames.length - 1]?.result).toEqual([[1, 1], [2, 1]]);
  });
});
