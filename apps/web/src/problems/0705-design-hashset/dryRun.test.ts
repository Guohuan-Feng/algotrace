import { describe, expect, test } from "vitest"; import { createHashSetDryRun } from "./dryRun";
describe("Design HashSet dry run", () => { test("tracks add remove and contains", () => { const { frames } = createHashSetDryRun(["add 1", "add 2", "contains 1", "contains 3", "remove 2", "contains 2"]); expect(frames[frames.length - 1]?.outputs).toEqual([true, false, false]); }); });
