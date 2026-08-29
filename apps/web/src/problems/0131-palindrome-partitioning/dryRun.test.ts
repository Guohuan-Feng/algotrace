import { describe, expect, test } from "vitest";
import { createPalindromePartitioningDryRun } from "./dryRun";

describe("Palindrome Partitioning dry run", () => {
  test("keeps only palindromic segments while enumerating aab", () => {
    const { frames } = createPalindromePartitioningDryRun("aab");
    const last = frames[frames.length - 1]!;

    expect(last.result).toEqual([["a", "a", "b"], ["aa", "b"]]);
  });
});
