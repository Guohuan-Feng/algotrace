import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 169,
  title: "Majority Element",
  cnTitle: "多数元素",
  slug: "majority-element",
  difficulty: "Easy",
  tags: ["Array", "Hash Table", "Divide and Conquer", "Sorting", "Counting"],
  pattern: "Boyer-Moore voting",
  collections: ["Hot 150", "Array"],
  hasVisualizer: true,
  summary: "Ready visualizer: watch matching votes grow the candidate count and opposing values cancel one vote at a time.",
} satisfies ReadyProblemDefinition;
