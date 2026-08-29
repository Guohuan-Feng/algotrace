import { describe, expect, test } from "vitest";
import { createMajorityElementDryRun } from "./dryRun";

describe("Majority Element dry run", () => {
  test("keeps the majority candidate after vote cancellations in the official example", () => {
    const { frames } = createMajorityElementDryRun([2, 2, 1, 1, 1, 2, 2]);

    expect(frames.some((frame) => frame.phase === "cancel")).toBe(true);
    expect(frames[frames.length - 1]?.result).toBe(2);
    expect(frames[frames.length - 1]?.count).toBeGreaterThan(0);
  });

  test("adopts a new candidate when the vote count is zero", () => {
    const { frames } = createMajorityElementDryRun([2, 3, 3]);

    expect(frames.some((frame) => frame.phase === "choose" && frame.candidate === 3)).toBe(true);
    expect(frames[frames.length - 1]?.result).toBe(3);
  });
});
