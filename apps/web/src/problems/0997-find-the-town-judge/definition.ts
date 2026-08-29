import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 997,
  title: "Find the Town Judge",
  cnTitle: "找到小镇的法官",
  slug: "find-the-town-judge",
  difficulty: "Easy",
  tags: ["Array", "Hash Table", "Graph"],
  pattern: "Indegree and outdegree classification",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: record each trust edge in indegree and outdegree arrays, then identify the only possible judge.",
} satisfies ReadyProblemDefinition;
