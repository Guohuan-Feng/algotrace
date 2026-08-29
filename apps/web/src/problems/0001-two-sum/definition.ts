import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 1,
  title: "Two Sum",
  cnTitle: "两数之和",
  slug: "two-sum",
  difficulty: "Easy",
  tags: ["Array", "Hash Table"],
  pattern: "One-pass complement map",
  collections: ["Hash Table", "Hot 150"],
  hasVisualizer: true,
  summary: "Ready visualizer: compute each complement and look it up before storing the current value.",
} satisfies ReadyProblemDefinition;
