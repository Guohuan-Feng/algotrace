import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 215,
  title: "Kth Largest Element in an Array",
  cnTitle: "数组中的第 K 个最大元素",
  slug: "kth-largest-element-in-an-array",
  difficulty: "Medium",
  tags: ["Array", "Heap", "Divide and Conquer"],
  pattern: "Size-k min-heap",
  collections: ["Heap"],
  hasVisualizer: true,
  summary: "Ready visualizer: retain only k values and read the kth largest from the min-heap root.",
} satisfies ReadyProblemDefinition;
