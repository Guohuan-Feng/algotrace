import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 127,
  title: "Word Ladder",
  cnTitle: "单词接龙",
  slug: "word-ladder",
  difficulty: "Hard",
  tags: ["Hash Table", "String", "Breadth-First Search"],
  pattern: "One-letter transformation breadth-first search",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: generate every one-letter mutation, enqueue unseen dictionary words, and stop at the first target dequeue.",
} satisfies ReadyProblemDefinition;
