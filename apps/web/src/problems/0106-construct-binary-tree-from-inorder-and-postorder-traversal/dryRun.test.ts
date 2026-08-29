import { describe, expect, test } from "vitest";
import { createInorderPostorderBuildDryRun } from "./dryRun";

describe("Construct Binary Tree from Inorder and Postorder dry run", () => {
  test("builds the official first example with the expected root", () => {
    const { frames } = createInorderPostorderBuildDryRun([9, 3, 15, 20, 7], [9, 15, 7, 20, 3]);
    const last = frames[frames.length - 1];
    expect(last?.rootValue).toBe(3);
    expect(last?.nodeValues).toEqual(expect.arrayContaining([3, 9, 20, 15, 7]));
  });

  test("builds the official single-node example", () => {
    const { frames } = createInorderPostorderBuildDryRun([-1], [-1]);
    expect(frames[frames.length - 1]?.rootValue).toBe(-1);
  });
});
