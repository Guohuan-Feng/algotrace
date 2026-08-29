import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 28,
  title: "Find the Index of the First Occurrence in a String",
  cnTitle: "找出字符串中第一个匹配项的下标",
  slug: "find-the-index-of-the-first-occurrence-in-a-string",
  difficulty: "Easy",
  tags: ["String", "String Matching"],
  pattern: "Substring matching",
  collections: ["Hot 150"],
  hasVisualizer: true,
  summary: "Ready visualizer: align the needle at each start, compare characters left to right, and shift after the first mismatch.",
} satisfies ReadyProblemDefinition;
