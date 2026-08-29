import { describe, expect, test } from "vitest";
import { createReverseStringDryRun } from "./dryRun";

describe("Reverse String dry run", () => {
  test("reverses the official first example in place", () => {
    const { frames } = createReverseStringDryRun(["h", "e", "l", "l", "o"]);

    expect(frames[frames.length - 1]?.result).toEqual(["o", "l", "l", "e", "h"]);
    expect(frames.some((frame) => frame.phase === "swap" && frame.left === 0 && frame.right === 4)).toBe(true);
  });

  test("handles the official unicode-character example", () => {
    const { frames } = createReverseStringDryRun(["H", "a", "n", "n", "a", "h"]);

    expect(frames[frames.length - 1]?.result).toEqual(["h", "a", "n", "n", "a", "H"]);
  });
});
