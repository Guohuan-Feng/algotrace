import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 152,
  title: "Maximum Product Subarray",
  cnTitle: "乘积最大子数组",
  slug: "maximum-product-subarray",
  difficulty: "Medium",
  tags: ["Array", "Dynamic Programming"],
  pattern: "Track rolling maximum and minimum products",
  collections: ["Dynamic Programming"],
  hasVisualizer: true,
  summary: "Ready visualizer: preserve both rolling product extremes so a negative value can flip the answer.",
} satisfies ReadyProblemDefinition;
