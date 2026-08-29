import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 35,
  title: "Search Insert Position",
  cnTitle: "搜索插入位置",
  slug: "search-insert-position",
  difficulty: "Easy",
  tags: ["Array", "Binary Search"],
  pattern: "Lower bound",
  collections: ["Hot 150"],
  hasVisualizer: true,
  summary: "Ready visualizer: use binary search to return either the matching index or the first position greater than the target.",
} satisfies ReadyProblemDefinition;
