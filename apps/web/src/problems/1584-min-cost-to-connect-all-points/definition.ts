import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 1584,
  title: "Min Cost to Connect All Points",
  cnTitle: "连接所有点的最小费用",
  slug: "min-cost-to-connect-all-points",
  difficulty: "Medium",
  tags: ["Array", "Graph", "Minimum Spanning Tree", "Heap"],
  pattern: "Prim's algorithm with a min-heap",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "用 Prim 算法不断弹出最便宜的候选连接；每个点首次加入 MST 时累加曼哈顿距离。",
} satisfies ReadyProblemDefinition;
