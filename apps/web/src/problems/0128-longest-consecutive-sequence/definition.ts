import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 128,
  "title": "Longest Consecutive Sequence",
  "cnTitle": "最长连续序列",
  "slug": "longest-consecutive-sequence",
  "difficulty": "Medium",
  "tags": [
    "Array",
    "Hash Table",
    "Union Find"
  ],
  "pattern": "Sequence starts",
  "collections": [
    "Hot 150"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: build a set, start only from sequence heads, and count consecutive values."
} satisfies ReadyProblemDefinition;
