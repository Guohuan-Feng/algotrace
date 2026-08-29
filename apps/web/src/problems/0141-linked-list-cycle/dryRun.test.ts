import { describe, expect, test } from "vitest";
import { createLinkedListCycleDryRun } from "./dryRun";

describe("Linked List Cycle dry run", () => {
  test("finds the meeting point in the official first example", () => {
    const { frames } = createLinkedListCycleDryRun([3, 2, 0, -4], 1);
    const done = frames[frames.length - 1];

    expect(done?.result).toBe(true);
    expect(done?.meetingId).toBe("node-3");
  });

  test("returns false when fast reaches the end", () => {
    const { frames } = createLinkedListCycleDryRun([1], -1);

    expect(frames[frames.length - 1]?.result).toBe(false);
  });
});
