import { hot150Problems } from "./hot150Catalog";
import type { Problem } from "./types";

const extraRoadmapProblems: Problem[] = [
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
    id: 417,
    title: "Pacific Atlantic Water Flow",
    cnTitle: "太平洋大西洋水流问题",
    slug: "pacific-atlantic-water-flow",
    difficulty: "Medium",
    tags: ["DFS", "BFS", "Matrix"],
    pattern: "Reverse ocean DFS",
    hasVisualizer: false,
    summary: "Search from each ocean inward and intersect reachable cells.",
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
  {
    id: 994,
    title: "Rotting Oranges",
    cnTitle: "腐烂的橘子",
    slug: "rotting-oranges",
    difficulty: "Medium",
    tags: ["BFS", "Matrix", "Queue"],
    pattern: "Multi-source BFS",
    hasVisualizer: false,
    summary: "Spread infection one minute per BFS level.",
  },
];

export const problemCatalog = mergeProblems([...hot150Problems, ...extraRoadmapProblems]);

export const sortedProblems = [...problemCatalog].sort((a, b) => a.id - b.id);

export const allTags = Array.from(new Set(problemCatalog.flatMap((problem) => problem.tags))).sort();

export const allCollections = Array.from(
  new Set(problemCatalog.flatMap((problem) => problem.collections ?? [])),
).sort();

function mergeProblems(problems: Problem[]): Problem[] {
  const byId = new Map<number, Problem>();
  problems.forEach((problem) => byId.set(problem.id, problem));
  return [...byId.values()];
}
