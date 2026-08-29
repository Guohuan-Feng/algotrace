import { describe, expect, test } from "vitest";
import { createLinkedListCycleIIdryRun } from "./dryRun";

describe("Linked List Cycle II dry run", () => {
  test("finds the entry after the pointers meet in the official first example", () => {
    const { frames } = createLinkedListCycleIIdryRun([3, 2, 0, -4], 1);
    const done = frames[frames.length - 1];

    expect(done?.result).toBe(1);
    expect(done?.entryId).toBe("node-1");
  });

  test("returns None for the official third example without a cycle", () => {
    const { frames } = createLinkedListCycleIIdryRun([1], -1);

    expect(frames[frames.length - 1]?.result).toBeNull();
  });
});
