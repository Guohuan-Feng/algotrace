import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 131,
  title: "Palindrome Partitioning",
  cnTitle: "分割回文串",
  slug: "palindrome-partitioning",
  difficulty: "Medium",
  tags: ["String", "Dynamic Programming", "Backtracking"],
  pattern: "Palindrome-checked partition DFS",
  collections: ["Backtracking"],
  hasVisualizer: true,
  summary: "Ready visualizer: extend a segment, test it with inward pointers, and recurse only on palindromes.",
} satisfies ReadyProblemDefinition;
