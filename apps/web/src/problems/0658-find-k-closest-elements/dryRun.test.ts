import { describe, expect, test } from "vitest";
import { createKClosestDryRun } from "./dryRun";
describe("Find K Closest Elements dry run", () => { test("shrinks the array to the closest k-value window", () => { const { frames } = createKClosestDryRun([1, 2, 3, 4, 5], 4, 3); expect(frames[frames.length - 1]?.result).toEqual([1, 2, 3, 4]); expect(frames.some((frame) => frame.left === 0 && frame.right === 3)).toBe(true); }); });
