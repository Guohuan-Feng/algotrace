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
  {
    id: 1631,
    title: "Path With Minimum Effort",
    cnTitle: "最小体力消耗路径",
    slug: "path-with-minimum-effort",
    difficulty: "Medium",
    tags: ["Graph", "Dijkstra", "Matrix", "Heap", "Binary Search"],
    pattern: "Minimax path Dijkstra",
    collections: ["Graph"],
    hasVisualizer: true,
    visualizerKey: "path-with-minimum-effort",
    summary: "Ready visualizer: relax paths by minimizing the maximum height difference.",
  },
  {
    id: 9001,
    title: "Quick Sort",
    cnTitle: "快速排序",
    slug: "quick-sort",
    difficulty: "Medium",
    tags: ["Array", "Sorting", "Divide and Conquer", "Two Pointers"],
    pattern: "Partition quicksort",
    collections: ["Sorting"],
    hasVisualizer: true,
    visualizerKey: "quick-sort",
    summary: "Ready visualizer: partition around a pivot, move i/j pointers, swap, and recurse.",
  },
  {
    id: 9002,
    title: "Shortest Path Binary Matrix With Weight",
    cnTitle: "带权二进制矩阵最短路",
    slug: "shortest-path-binary-matrix-with-weight",
    difficulty: "Medium",
    tags: ["Graph", "Dijkstra", "Matrix", "Heap"],
    pattern: "Weighted grid Dijkstra",
    collections: ["Amazon 真题"],
    hasVisualizer: true,
    visualizerKey: "shortest-path-binary-matrix-with-weight",
    summary: "Ready visualizer: use a min heap to relax weighted 8-direction grid paths.",
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
