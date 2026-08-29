import { describe, expect, test } from "vitest";
import { createSubarraySumDryRun } from "./dryRun";
describe("Subarray Sum Equals K dry run", () => { test("counts every prior prefix with sum minus k", () => { const { frames } = createSubarraySumDryRun([1, 1, 1], 2); expect(frames[frames.length - 1]?.result).toBe(2); expect(frames.some((frame) => frame.count === 2)).toBe(true); }); });
