import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 42,
  title: "Trapping Rain Water",
  cnTitle: "接雨水",
  slug: "trapping-rain-water",
  difficulty: "Hard",
  tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
  pattern: "Two maxima from the shorter boundary",
  collections: ["Hot 150", "Two Pointers"],
  hasVisualizer: true,
  summary: "Ready visualizer: process the shorter boundary, update its maximum height, and add the water safely trapped above that bar.",
} satisfies ReadyProblemDefinition;
