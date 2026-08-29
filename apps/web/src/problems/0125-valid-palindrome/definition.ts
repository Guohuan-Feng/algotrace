import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 125,
  title: "Valid Palindrome",
  cnTitle: "验证回文串",
  slug: "valid-palindrome",
  difficulty: "Easy",
  tags: ["Two Pointers", "String"],
  pattern: "Filtered two pointers",
  collections: ["Hot 150", "Two Pointers", "String"],
  hasVisualizer: true,
  summary: "Ready visualizer: skip non-alphanumeric characters and compare lowercase characters from both ends.",
} satisfies ReadyProblemDefinition;
