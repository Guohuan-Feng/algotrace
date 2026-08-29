import { describe, expect, test } from "vitest"; import { createHashMapDryRun } from "./dryRun";
describe("Design HashMap dry run", () => { test("stores replaces reads and removes key values", () => { const { frames } = createHashMapDryRun(["put 1 1", "put 2 2", "get 1", "get 3", "put 2 1", "get 2", "remove 2", "get 2"]); expect(frames[frames.length - 1]?.outputs).toEqual([1, -1, 1, -1]); }); });
