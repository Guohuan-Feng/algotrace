import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 202,
  title: "Happy Number",
  cnTitle: "快乐数",
  slug: "happy-number",
  difficulty: "Easy",
  tags: ["Hash Table", "Math", "Two Pointers"],
  pattern: "Cycle detection with set",
  collections: ["Hot 150", "Hash Table", "Math"],
  hasVisualizer: true,
  summary: "Ready visualizer: square each digit, track every seen value, and stop at 1 or the first repeated value.",
} satisfies ReadyProblemDefinition;
