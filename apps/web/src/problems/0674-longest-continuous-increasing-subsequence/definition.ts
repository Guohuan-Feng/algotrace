import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 674,
  "title": "Longest Continuous Increasing Subsequence",
  "cnTitle": "最长连续递增序列",
  "slug": "longest-continuous-increasing-subsequence",
  "difficulty": "Easy",
  "tags": [
    "Array",
    "Dynamic Programming"
  ],
  "pattern": "Contiguous increasing DP",
  "collections": [
    "Dynamic Programming"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: scan adjacent values and update dp[i] for the current increasing run."
} satisfies ReadyProblemDefinition;
