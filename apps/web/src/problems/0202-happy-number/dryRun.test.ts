import { describe, expect, test } from "vitest";
import { createHappyNumberDryRun } from "./dryRun";

describe("Happy Number dry run", () => {
  test("reaches one for the official happy example", () => {
    const { frames } = createHappyNumberDryRun(19);

    expect(frames.some((frame) => frame.phase === "transform" && frame.next === 82)).toBe(true);
    expect(frames[frames.length - 1]?.result).toBe(true);
  });

  test("stops when a previously seen number repeats", () => {
    const { frames } = createHappyNumberDryRun(2);

    expect(frames.some((frame) => frame.phase === "cycle")).toBe(true);
    expect(frames[frames.length - 1]?.result).toBe(false);
  });
});
