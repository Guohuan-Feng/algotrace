import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 51,
  title: "N-Queens",
  cnTitle: "N 皇后",
  slug: "n-queens",
  difficulty: "Hard",
  tags: ["Array", "Backtracking", "Matrix"],
  pattern: "Row-by-row constraint backtracking",
  collections: ["Backtracking"],
  hasVisualizer: true,
  summary: "Ready visualizer: place queens by row, reserve column and diagonal sets, then undo each choice.",
} satisfies ReadyProblemDefinition;
