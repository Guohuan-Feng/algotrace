import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 347,
  title: "Top K Frequent Elements",
  cnTitle: "前 K 个高频元素",
  slug: "top-k-frequent-elements",
  difficulty: "Medium",
  tags: ["Array", "Hash Table", "Divide and Conquer", "Sorting", "Heap (Priority Queue)", "Bucket Sort", "Counting", "Quickselect"],
  pattern: "Frequency map plus size-k min-heap",
  collections: ["Hash Table", "Heap"],
  hasVisualizer: true,
  summary: "Ready visualizer: count every value, then retain only the k highest-frequency entries in a min-heap.",
} satisfies ReadyProblemDefinition;
