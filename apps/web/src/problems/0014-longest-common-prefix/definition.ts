import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 14,
  title: "Longest Common Prefix",
  cnTitle: "最长公共前缀",
  slug: "longest-common-prefix",
  difficulty: "Easy",
  tags: ["String", "Trie"],
  pattern: "Prefix shrinking",
  collections: ["Hot 150"],
  hasVisualizer: true,
  summary: "Ready visualizer: start with the first word and shorten the candidate until every following word begins with it.",
} satisfies ReadyProblemDefinition;
