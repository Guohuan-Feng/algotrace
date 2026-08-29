import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 49,
  title: "Group Anagrams",
  cnTitle: "字母异位词分组",
  slug: "group-anagrams",
  difficulty: "Medium",
  tags: ["Array", "Hash Table", "String", "Sorting"],
  pattern: "Sorted-letter hash key",
  collections: ["Hot 150", "Hash Table"],
  hasVisualizer: true,
  summary: "Ready visualizer: sort each word into a canonical signature, then append it to that signature's hash-map bucket.",
} satisfies ReadyProblemDefinition;
