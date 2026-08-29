import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 3,
  title: "Longest Substring Without Repeating Characters",
  cnTitle: "无重复字符的最长子串",
  slug: "longest-substring-without-repeating-characters",
  difficulty: "Medium",
  tags: ["Hash Table", "String", "Sliding Window"],
  pattern: "Unique-character sliding window",
  collections: ["Sliding Window"],
  hasVisualizer: true,
  summary: "Ready visualizer: expand the right pointer and advance the left pointer until every window character is unique.",
} satisfies ReadyProblemDefinition;
