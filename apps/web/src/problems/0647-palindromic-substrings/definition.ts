import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 647,
  title: "Palindromic Substrings",
  cnTitle: "回文子串",
  slug: "palindromic-substrings",
  difficulty: "Medium",
  tags: ["String", "Dynamic Programming", "Two Pointers"],
  pattern: "Center expansion",
  collections: ["Dynamic Programming"],
  hasVisualizer: true,
  summary: "Ready visualizer: expand from every odd and even center, counting each matching palindrome before the pointers move outward.",
} satisfies ReadyProblemDefinition;
