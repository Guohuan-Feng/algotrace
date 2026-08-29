import { describe, expect, test } from "vitest";
import { createRemoveLinkedListElementsDryRun } from "./dryRun";

describe("Remove Linked List Elements dry run", () => {
  test("uses a dummy node to remove matching values throughout the official first list", () => {
    const { frames } = createRemoveLinkedListElementsDryRun([1, 2, 6, 3, 4, 5, 6], 6);

    expect(frames.filter((frame) => frame.phase === "unlink")).toHaveLength(2);
    expect(frames[frames.length - 1]?.result).toEqual([1, 2, 3, 4, 5]);
  });

  test("removes every node when all values match", () => {
    const { frames } = createRemoveLinkedListElementsDryRun([7, 7], 7);

    expect(frames[frames.length - 1]?.result).toEqual([]);
  });
});
