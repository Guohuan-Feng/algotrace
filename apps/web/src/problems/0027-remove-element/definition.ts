import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 27,
  title: "Remove Element",
  cnTitle: "移除元素",
  slug: "remove-element",
  difficulty: "Easy",
  tags: ["Array", "Two Pointers"],
  pattern: "In-place write pointer",
  collections: ["Hot 150"],
  hasVisualizer: true,
  summary: "Ready visualizer: read every number, copy only non-target values into the compacted prefix, and return its length.",
} satisfies ReadyProblemDefinition;
