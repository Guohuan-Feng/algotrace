import { describe, expect, test } from "vitest";
import { createCloneGraphDryRun } from "./dryRun";

describe("Clone Graph dry run", () => {
  test("creates one clone per reachable original node and preserves its neighbors", () => {
    const { frames } = createCloneGraphDryRun([[2, 4], [1, 3], [2, 4], [1, 3]]);
    const last = frames[frames.length - 1]!;

    expect(last.result).toEqual([[2, 4], [1, 3], [2, 4], [1, 3]]);
    expect(last.cloneMap).toEqual([1, 2, 3, 4]);
  });
});
