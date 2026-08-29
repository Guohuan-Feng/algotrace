import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 189,
  title: "Rotate Array",
  cnTitle: "轮转数组",
  slug: "rotate-array",
  difficulty: "Medium",
  tags: ["Array", "Math", "Two Pointers"],
  pattern: "Three reversals",
  collections: ["Hot 150", "Array", "Two Pointers"],
  hasVisualizer: true,
  summary: "Ready visualizer: normalize k, reverse the whole array, then reverse its two sections in place.",
} satisfies ReadyProblemDefinition;
