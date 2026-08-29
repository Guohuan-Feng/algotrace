import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 496,
  title: "Next Greater Element I",
  cnTitle: "下一个更大元素 I",
  slug: "next-greater-element-i",
  difficulty: "Easy",
  tags: ["Array", "Hash Table", "Stack", "Monotonic Stack"],
  pattern: "Monotonic decreasing stack",
  collections: ["Stack"],
  hasVisualizer: true,
  summary: "Ready visualizer: resolve next-greater values while a decreasing stack is scanned from left to right.",
} satisfies ReadyProblemDefinition;
