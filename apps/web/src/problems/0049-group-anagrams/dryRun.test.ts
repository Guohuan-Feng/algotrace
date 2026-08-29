import { describe, expect, test } from "vitest";
import { createGroupAnagramsDryRun } from "./dryRun";

describe("Group Anagrams dry run", () => {
  test("groups the three anagram buckets from LeetCode example 1", () => {
    const { frames } = createGroupAnagramsDryRun(["eat", "tea", "tan", "ate", "nat", "bat"]);
    const final = frames[frames.length - 1];

    expect(final?.result).toEqual([["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]);
  });

  test("keeps the empty string in its own bucket", () => {
    const { frames } = createGroupAnagramsDryRun([""]);

    expect(frames[frames.length - 1]?.result).toEqual([[""]]);
  });
});
