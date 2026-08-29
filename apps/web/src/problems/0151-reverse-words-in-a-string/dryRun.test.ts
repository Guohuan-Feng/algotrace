import { describe, expect, test } from "vitest";
import { createReverseWordsDryRun } from "./dryRun";

describe("Reverse Words in a String dry run", () => {
  test("drops extra spaces and reverses words in the official first example", () => {
    const { frames } = createReverseWordsDryRun("the sky is blue");

    expect(frames[frames.length - 1]?.result).toBe("blue is sky the");
    expect(frames.find((frame) => frame.phase === "split")?.words).toEqual(["the", "sky", "is", "blue"]);
  });

  test("trims the leading and trailing spaces from the official second example", () => {
    const { frames } = createReverseWordsDryRun("  hello world  ");

    expect(frames[frames.length - 1]?.result).toBe("world hello");
  });
});
