import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 117,
  title: "Populating Next Right Pointers in Each Node II",
  cnTitle: "填充每个节点的下一个右侧节点指针 II",
  slug: "populating-next-right-pointers-in-each-node-ii",
  difficulty: "Medium",
  tags: ["Linked List", "Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
  pattern: "Level-order next-pointer linking",
  collections: ["Hot 150", "Tree", "BFS"],
  hasVisualizer: true,
  summary: "Ready visualizer: BFS connects each level left-to-right through next pointers.",
} satisfies ReadyProblemDefinition;
