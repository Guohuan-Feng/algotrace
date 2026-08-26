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

  test("discovers the Bellman-Ford cheapest flights visualizer", () => {
    const flights = readyProblems.find((problem) => problem.slug === "cheapest-flights-within-k-stops");

    expect(flights).toMatchObject({
      id: 787,
      collections: ["Graph"],
      hasVisualizer: true,
    });
    expect(getVisualizerBySlug("cheapest-flights-within-k-stops")).toBeDefined();
  });

  test("discovers both center-expansion palindrome visualizers", () => {
    expect(readyProblems.find((problem) => problem.slug === "longest-palindromic-substring")).toMatchObject({
      id: 5,
      collections: ["Hot 150"],
      hasVisualizer: true,
    });
    expect(readyProblems.find((problem) => problem.slug === "palindromic-substrings")).toMatchObject({
      id: 647,
      pattern: "Center expansion",
      hasVisualizer: true,
    });
    expect(getVisualizerBySlug("longest-palindromic-substring")).toBeDefined();
    expect(getVisualizerBySlug("palindromic-substrings")).toBeDefined();
  });
});
