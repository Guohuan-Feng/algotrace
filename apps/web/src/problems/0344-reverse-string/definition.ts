import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 344,
  title: "Reverse String",
  cnTitle: "反转字符串",
  slug: "reverse-string",
  difficulty: "Easy",
  tags: ["Two Pointers", "String"],
  pattern: "Two pointers swap from both ends",
  collections: ["Two Pointers", "String"],
  hasVisualizer: true,
  summary: "Ready visualizer: move left and right pointers inward, swapping one mirrored character pair per iteration.",
} satisfies ReadyProblemDefinition;
