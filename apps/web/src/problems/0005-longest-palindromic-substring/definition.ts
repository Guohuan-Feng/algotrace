import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 5,
  title: "Longest Palindromic Substring",
  cnTitle: "最长回文子串",
  slug: "longest-palindromic-substring",
  difficulty: "Medium",
  tags: ["String", "Dynamic Programming", "Two Pointers"],
  pattern: "Center expansion",
  collections: ["Hot 150"],
  hasVisualizer: true,
  summary: "Ready visualizer: expand from every odd and even center, return each palindrome, then keep the longest result.",
} satisfies ReadyProblemDefinition;
