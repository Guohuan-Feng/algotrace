import { describe, expect, test } from "vitest";
import { createDecodeStringDryRun } from "./dryRun";

describe("Decode String dry run", () => {
  test("unwinds nested prefixes for LeetCode example 2", () => {
    const { frames } = createDecodeStringDryRun("3[a2[c]]");
    const innerClose = frames.find((frame) => frame.phase === "close" && frame.index === 6);

    expect(innerClose).toMatchObject({ current: "acc", stack: [["", 3]] });
    expect(frames[frames.length - 1]?.result).toBe("accaccacc");
  });

  test("joins independent repeated blocks for LeetCode example 1", () => {
    const { frames } = createDecodeStringDryRun("3[a]2[bc]");

    expect(frames[frames.length - 1]?.result).toBe("aaabcbc");
  });
});
