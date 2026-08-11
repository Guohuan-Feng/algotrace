import { describe, expect, test } from "vitest";
import { createCourseScheduleBfsDryRun, createCourseScheduleDfsDryRun } from "./dryRun";

describe("Course Schedule dry runs", () => {
  test("DFS detects the cycle in the second official example", () => {
    const { frames } = createCourseScheduleDfsDryRun(2, [[1, 0], [0, 1]]);

    expect(frames[frames.length - 1].result).toBe(false);
  });

  test("BFS releases zero-indegree neighbors and finishes the first official example", () => {
    const { frames } = createCourseScheduleBfsDryRun(2, [[1, 0]]);
    const finalFrame = frames[frames.length - 1];

    expect(frames.some((frame) => frame.queuedCourse === 1)).toBe(true);
    expect(finalFrame.result).toBe(true);
    expect(finalFrame.count).toBe(2);
  });
});
