import { describe, expect, test } from "vitest";
import { getVisualizerBySlug, readyProblems } from "../../problems";

const intervalVisualizerSlugs = [
  "number-of-airplanes-in-the-sky",
  "meeting-rooms",
  "meeting-rooms-ii",
  "merge-intervals",
  "insert-interval",
  "remove-interval",
  "non-overlapping-intervals",
  "remove-covered-intervals",
  "meeting-scheduler",
  "data-stream-as-disjoint-intervals",
];

describe("扫描线基础算法模块发现", () => {
  test("已开放题目均已作为可视化题目自动发现", () => {
    expect(
      readyProblems.filter((problem) => problem.collections?.includes("扫描线基础算法")).map((problem) => problem.slug),
    ).toEqual(expect.arrayContaining(intervalVisualizerSlugs));

    intervalVisualizerSlugs.forEach((slug) => {
      expect(getVisualizerBySlug(slug)).not.toBeNull();
    });
  });
});
