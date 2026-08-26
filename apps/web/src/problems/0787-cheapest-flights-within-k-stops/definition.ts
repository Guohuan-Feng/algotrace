import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 787,
  title: "Cheapest Flights Within K Stops",
  cnTitle: "K 站中转内最便宜的航班",
  slug: "cheapest-flights-within-k-stops",
  difficulty: "Medium",
  tags: ["Dynamic Programming", "Graph", "Bellman-Ford", "Shortest Path"],
  pattern: "Bellman-Ford with a copied distance array",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "每一轮只根据上一轮 dist 松弛航线；temp 把本轮更新隔离开，因此最多只会多使用一条边。",
} satisfies ReadyProblemDefinition;
