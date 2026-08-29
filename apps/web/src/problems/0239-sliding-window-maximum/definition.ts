import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 239,
  title: "Sliding Window Maximum",
  cnTitle: "滑动窗口最大值",
  slug: "sliding-window-maximum",
  difficulty: "Hard",
  tags: ["Array", "Queue", "Sliding Window", "Monotonic Queue", "Heap"],
  pattern: "Monotonic decreasing deque",
  collections: ["Sliding Window", "Stack"],
  hasVisualizer: true,
  summary: "Ready visualizer: keep candidate indices in decreasing value order, removing both expired and dominated entries.",
} satisfies ReadyProblemDefinition;
