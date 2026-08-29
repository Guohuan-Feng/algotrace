import { describe, expect, test } from "vitest";
import { createBalancedTreeDryRun } from "./dryRun";

describe("Balanced Binary Tree dry run", () => {
  test("accepts the official balanced example", () => {
    const { frames } = createBalancedTreeDryRun([3, 9, 20, null, null, 15, 7]);
    expect(frames[frames.length - 1]?.result).toBe(true);
  });

  test("rejects the official unbalanced example", () => {
    const { frames } = createBalancedTreeDryRun([1, 2, 2, 3, 3, null, null, 4, 4]);
    expect(frames[frames.length - 1]?.result).toBe(false);
  });
});
