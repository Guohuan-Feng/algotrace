import type { Problem } from "./types";

export const additionalRoadmapProblems: Problem[] = [
  {
    id: 51,
    title: "N-Queens",
    cnTitle: "N 皇后",
    slug: "n-queens",
    difficulty: "Hard",
    tags: ["Backtracking", "Matrix"],
    pattern: "Constraint backtracking",
    hasVisualizer: false,
    summary: "Place queens row by row while checking columns and diagonals.",
  },
  {
    id: 542,
    title: "01 Matrix",
    cnTitle: "01 矩阵",
    slug: "01-matrix",
    difficulty: "Medium",
    tags: ["BFS", "Matrix", "Dynamic Programming"],
    pattern: "Multi-source BFS",
    hasVisualizer: false,
    summary: "Start BFS from all zero cells to fill nearest-zero distances.",
  },
];
