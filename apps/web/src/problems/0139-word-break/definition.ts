import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 139,
  title: "Word Break",
  cnTitle: "单词拆分",
  slug: "word-break",
  difficulty: "Medium",
  tags: ["Array", "Hash Table", "String", "Dynamic Programming", "Trie", "Memoization"],
  pattern: "Prefix segmentation dynamic programming",
  collections: ["Dynamic Programming", "Trie"],
  hasVisualizer: true,
  summary: "Ready visualizer: test every final word split of each prefix and stop at its first valid split.",
} satisfies ReadyProblemDefinition;
