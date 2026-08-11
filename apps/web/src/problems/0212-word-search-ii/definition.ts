import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 212,
  "title": "Word Search II",
  "cnTitle": "单词搜索 II",
  "slug": "word-search-ii",
  "difficulty": "Hard",
  "tags": [
    "Trie",
    "DFS",
    "Backtracking",
    "Matrix"
  ],
  "pattern": "Trie-pruned grid DFS",
  "collections": [
    "Hot 150"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: build the Trie first, then trace grid DFS pruning."
} satisfies ReadyProblemDefinition;
