import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 36,
  title: "Valid Sudoku",
  cnTitle: "有效的数独",
  slug: "valid-sudoku",
  difficulty: "Medium",
  tags: ["Array", "Hash Table", "Matrix"],
  pattern: "Set validation",
  collections: ["Hot 150"],
  hasVisualizer: true,
  summary: "Ready visualizer: scan each filled cell and verify its row, column, and 3x3 box sets before recording it.",
} satisfies ReadyProblemDefinition;
