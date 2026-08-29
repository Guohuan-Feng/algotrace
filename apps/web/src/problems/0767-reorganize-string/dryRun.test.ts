import { describe, expect, test } from "vitest";
import { createReorganizeStringDryRun } from "./dryRun";

describe("Reorganize String dry run", () => {
  test("holds the prior character outside the heap until a different character is selected", () => {
    const { frames } = createReorganizeStringDryRun("aab");
    const last = frames[frames.length - 1]!;

    expect(last.result).toBe("aba");
    expect(frames.some((frame) => frame.phase === "restore-previous")).toBe(true);
  });
});
