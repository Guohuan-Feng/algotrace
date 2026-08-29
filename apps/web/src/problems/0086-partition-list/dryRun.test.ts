import { describe, expect, test } from "vitest";
import { createPartitionListDryRun } from "./dryRun";

describe("Partition List dry run", () => {
  test("keeps relative order in both partitions for LeetCode example 1", () => {
    const { frames } = createPartitionListDryRun([1, 4, 3, 2, 5, 2], 3);

    expect(frames[frames.length - 1]?.result).toEqual([1, 2, 2, 4, 3, 5]);
  });

  test("puts the small prefix ahead of the large suffix in LeetCode example 2", () => {
    const { frames } = createPartitionListDryRun([2, 1], 2);

    expect(frames[frames.length - 1]?.result).toEqual([1, 2]);
  });
});
