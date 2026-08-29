import { describe, expect, test } from "vitest";
import { createAlienDictionaryDryRun } from "./dryRun";

describe("Verifying an Alien Dictionary dry run", () => {
  test("accepts sorted words and rejects a larger prefix before its prefix", () => {
    const ordered = createAlienDictionaryDryRun(["hello", "leetcode"], "hlabcdefgijkmnopqrstuvwxyz").frames;
    const invalidPrefix = createAlienDictionaryDryRun(["apple", "app"], "abcdefghijklmnopqrstuvwxyz").frames;

    expect(ordered[ordered.length - 1]!.result).toBe(true);
    expect(invalidPrefix[invalidPrefix.length - 1]!.result).toBe(false);
  });
});
