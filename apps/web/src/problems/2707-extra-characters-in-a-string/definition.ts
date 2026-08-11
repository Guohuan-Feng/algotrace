import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 2707,
  "title": "Extra Characters in a String",
  "cnTitle": "字符串中的额外字符",
  "slug": "extra-characters-in-a-string",
  "difficulty": "Medium",
  "tags": [
    "String",
    "Hash Table",
    "Dynamic Programming"
  ],
  "pattern": "Prefix DP with word matching",
  "collections": [
    "Dynamic Programming"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: begin with one extra character, then replace that cost whenever a dictionary word ends at i."
} satisfies ReadyProblemDefinition;
