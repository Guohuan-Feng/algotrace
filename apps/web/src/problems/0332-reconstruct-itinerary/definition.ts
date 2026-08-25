import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 332,
  title: "Reconstruct Itinerary",
  cnTitle: "重新安排行程",
  slug: "reconstruct-itinerary",
  difficulty: "Hard",
  tags: ["Graph", "DFS", "Eulerian Path", "Heap"],
  pattern: "Hierholzer DFS with lexicographic min-heaps",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "用最小堆按字典序取下一站；走不动时后序回填机场，最后反转得到完整行程。",
} satisfies ReadyProblemDefinition;
