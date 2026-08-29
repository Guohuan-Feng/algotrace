import { describe, expect, test } from "vitest";
import { createPermutationInStringDryRun } from "./dryRun";
describe("Permutation in String dry run", () => { test("finds a matching fixed-size window", () => { const { frames } = createPermutationInStringDryRun("ab", "eidbaooo"); expect(frames[frames.length - 1]?.result).toBe(true); expect(frames.some((frame) => frame.window === "ba" && frame.matches)).toBe(true); }); });
