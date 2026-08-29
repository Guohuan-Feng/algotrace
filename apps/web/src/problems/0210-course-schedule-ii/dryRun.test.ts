import { describe, expect, test } from "vitest";
import { createCourseScheduleIiDryRun } from "./dryRun";

describe("Course Schedule II dry run", () => {
  test("appends courses postorder then reverses the list into a valid schedule", () => {
    const { frames } = createCourseScheduleIiDryRun(2, [[1, 0]]);
    const finalFrame = frames[frames.length - 1];

    expect(frames.some((frame) => frame.res.join(",") === "1,0")).toBe(true);
    expect(finalFrame?.result).toEqual([0, 1]);
  });

  test("returns an empty schedule when the DFS detects a cycle", () => {
    const { frames } = createCourseScheduleIiDryRun(2, [[1, 0], [0, 1]]);

    expect(frames[frames.length - 1]?.result).toEqual([]);
  });
});
