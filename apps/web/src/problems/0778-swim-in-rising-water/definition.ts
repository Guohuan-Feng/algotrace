import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 778,
  title: "Swim in Rising Water",
  cnTitle: "水位上升的泳池中游泳",
  slug: "swim-in-rising-water",
  difficulty: "Hard",
  tags: ["Array", "Graph", "Heap", "Matrix", "Dijkstra"],
  pattern: "Min-heap flood fill",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "每次从最小堆取出当前所需水位最低的格子；首次访问格子时才固定水位并继续扩张。",
} satisfies ReadyProblemDefinition;
