import { describe, expect, test } from "vitest";
import { getVisualizerBySlug, readyProblems } from "./index";

describe("problem module discovery", () => {
  test("discovers a ready problem definition and its lazy visualizer", () => {
    const sqrt = readyProblems.find((problem) => problem.slug === "sqrtx");

    expect(sqrt).toMatchObject({
      id: 69,
      title: "Sqrt(x)",
      hasVisualizer: true,
    });
    expect(getVisualizerBySlug("sqrtx")).toBeDefined();
  });
});
