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

  test("discovers the itinerary graph visualizer", () => {
    const itinerary = readyProblems.find((problem) => problem.slug === "reconstruct-itinerary");

    expect(itinerary).toMatchObject({
      id: 332,
      collections: ["Graph"],
      hasVisualizer: true,
    });
    expect(getVisualizerBySlug("reconstruct-itinerary")).toBeDefined();
  });

  test("discovers the Prim MST visualizer", () => {
    const points = readyProblems.find((problem) => problem.slug === "min-cost-to-connect-all-points");

    expect(points).toMatchObject({
      id: 1584,
      collections: ["Graph"],
      hasVisualizer: true,
    });
    expect(getVisualizerBySlug("min-cost-to-connect-all-points")).toBeDefined();
  });

  test("discovers the rising-water min-heap visualizer", () => {
    const swim = readyProblems.find((problem) => problem.slug === "swim-in-rising-water");

    expect(swim).toMatchObject({
      id: 778,
      collections: ["Graph"],
      hasVisualizer: true,
    });
    expect(getVisualizerBySlug("swim-in-rising-water")).toBeDefined();
  });
});
