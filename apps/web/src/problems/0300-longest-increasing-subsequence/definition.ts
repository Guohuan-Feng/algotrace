import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 300,
  "title": "Longest Increasing Subsequence",
  "cnTitle": "最长递增子序列",
  "slug": "longest-increasing-subsequence",
  "difficulty": "Medium",
  "tags": [
    "Array",
    "Dynamic Programming",
    "Binary Search"
  ],
  "pattern": "O(n^2) DP",
  "collections": [
    "Hot 150"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: compare each previous j with i and update dp[i] for the LIS ending at i."
} satisfies ReadyProblemDefinition;
