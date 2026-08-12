import { describe, expect, test } from "vitest";
import { createCourseScheduleIvDryRun } from "./dryRun";

describe("Course Schedule IV dry run", () => {
  test("runs a fresh DFS for every query and appends ordered results", () => {
    const { frames } = createCourseScheduleIvDryRun(2, [[1, 0]], [[0, 1], [1, 0]]);
    const finalFrame = frames[frames.length - 1];

    expect(frames.some((frame) => frame.title === "Query 1: 0 -> 1" && frame.visited.length === 0)).toBe(true);
    expect(frames.some((frame) => frame.title === "Reach target 0" && frame.queryIndex === 1)).toBe(true);
    expect(finalFrame.results).toEqual([false, true]);
  });

  test("returns false for queries with no prerequisite path", () => {
    const { frames } = createCourseScheduleIvDryRun(2, [], [[1, 0], [0, 1]]);

    expect(frames[frames.length - 1].results).toEqual([false, false]);
  });
});
