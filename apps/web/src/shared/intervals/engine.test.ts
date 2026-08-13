import { describe, expect, test } from "vitest";
import {
  createAirplanesDryRun,
  createInsertIntervalDryRun,
  createMeetingRoomsDryRun,
  createMeetingRoomsTwoDryRun,
  createMergeIntervalsDryRun,
  createNonOverlappingIntervalsDryRun,
  createRemoveCoveredIntervalsDryRun,
  createRemoveIntervalDryRun,
} from "./engine";

function finalFrame<T extends { frames: unknown[] }>(run: T) {
  return run.frames[run.frames.length - 1] as { result: unknown; output: Array<{ start: number; end: number }>; events?: Array<{ time: number; delta: number }> };
}

function bounds(items: Array<{ start: number; end: number }>) {
  return items.map(({ start, end }) => [start, end]);
}

describe("interval and sweep-line dry runs", () => {
  test("391 processes an equal-time end before a start", () => {
    const run = createAirplanesDryRun([[1, 2], [2, 4], [2, 3]]);
    const frame = finalFrame(run);
    const eventsAtTwo = frame.events?.filter((event) => event.time === 2).map((event) => event.delta);

    expect(eventsAtTwo).toEqual([-1, 1, 1]);
    expect(frame.result).toBe(2);
  });

  test("252 stops on the first overlapping neighboring meeting", () => {
    const frame = finalFrame(createMeetingRoomsDryRun([[0, 30], [5, 10], [15, 20]]));
    expect(frame.result).toBe(false);
  });

  test("253 releases a room before a same-time meeting begins", () => {
    const run = createMeetingRoomsTwoDryRun([[1, 4], [4, 5], [4, 6]]);
    const frame = finalFrame(run);
    const eventsAtFour = frame.events?.filter((event) => event.time === 4).map((event) => event.delta);

    expect(eventsAtFour).toEqual([-1, 1, 1]);
    expect(frame.result).toBe(2);
  });

  test("56 merges overlapping and touching intervals", () => {
    const frame = finalFrame(createMergeIntervalsDryRun([[1, 4], [4, 5], [8, 10]]));
    expect(bounds(frame.output)).toEqual([[1, 5], [8, 10]]);
  });

  test("57 bridges touching intervals through the new interval", () => {
    const frame = finalFrame(createInsertIntervalDryRun({ intervals: [[1, 2], [3, 5]], newInterval: [2, 3] }));
    expect(bounds(frame.output)).toEqual([[1, 5]]);
  });

  test("1272 preserves both fragments around a removal mask", () => {
    const frame = finalFrame(createRemoveIntervalDryRun({ intervals: [[0, 10]], toBeRemoved: [3, 7] }));
    expect(bounds(frame.output)).toEqual([[0, 3], [7, 10]]);
  });

  test("435 keeps touching intervals instead of treating them as overlap", () => {
    const frame = finalFrame(createNonOverlappingIntervalsDryRun([[1, 2], [2, 3], [3, 4]]));
    expect(frame.result).toBe(0);
    expect(bounds(frame.output)).toEqual([[1, 2], [2, 3], [3, 4]]);
  });

  test("1288 sorts equal-start intervals with the longer one first", () => {
    const run = createRemoveCoveredIntervalsDryRun([[1, 4], [1, 2], [2, 3]]);
    const firstFrame = run.frames[0];
    const frame = finalFrame(run);

    expect(bounds(firstFrame.lanes[1].intervals)).toEqual([[1, 4], [1, 2], [2, 3]]);
    expect(frame.result).toBe(1);
    expect(bounds(frame.output)).toEqual([[1, 4]]);
  });
});
