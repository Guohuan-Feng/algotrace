import { describe, expect, test } from "vitest";
import { createBinarySearchDryRun } from "./dryRun";
describe("Binary Search dry run", () => { test("narrows to the target index", () => { const { frames } = createBinarySearchDryRun([-1, 0, 3, 5, 9, 12], 9); expect(frames[frames.length - 1]?.result).toBe(4); expect(frames.some((frame) => frame.mid === 4)).toBe(true); }); });
