import { describe, expect, test } from "vitest";
import { createMaximumDepthNaryDryRun } from "./dryRun";

describe("Maximum Depth of N-ary Tree dry run", () => {
  test("records each recursive depth and returns the deepest branch", () => {
    const { frames } = createMaximumDepthNaryDryRun({
      value: 1,
      children: [
        { value: 3, children: [{ value: 5, children: [] }, { value: 6, children: [] }] },
        { value: 2, children: [] },
        { value: 4, children: [] },
      ],
    });

    expect(frames[frames.length - 1]?.result).toBe(3);
    expect(frames.some((frame) => frame.nodeValue === 5 && frame.depth === 3)).toBe(true);
  });
});
