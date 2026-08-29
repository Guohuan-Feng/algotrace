import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 703,
  title: "Kth Largest Element in a Stream",
  cnTitle: "数据流中的第 K 大元素",
  slug: "kth-largest-element-in-a-stream",
  difficulty: "Easy",
  tags: ["Tree", "Heap", "Design", "Data Stream"],
  pattern: "Persistent size-k min-heap",
  collections: ["Heap"],
  hasVisualizer: true,
  summary: "Ready visualizer: heapify the seed values, trim to k, then track each add() result from the min-heap root.",
} satisfies ReadyProblemDefinition;
