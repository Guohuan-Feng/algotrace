import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 973,
  title: "K Closest Points to Origin",
  cnTitle: "最接近原点的 K 个点",
  slug: "k-closest-points-to-origin",
  difficulty: "Medium",
  tags: ["Array", "Math", "Divide and Conquer", "Heap"],
  pattern: "Size-k max-heap via negative distance",
  collections: ["Heap"],
  hasVisualizer: true,
  summary: "Ready visualizer: use negative squared distances so each overflow removes the farthest point.",
} satisfies ReadyProblemDefinition;
