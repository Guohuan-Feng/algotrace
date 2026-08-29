import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 2,
  title: "Add Two Numbers",
  cnTitle: "两数相加",
  slug: "add-two-numbers",
  difficulty: "Medium",
  tags: ["Linked List", "Math", "Recursion"],
  pattern: "Digit-by-digit linked-list addition",
  collections: ["Linked List"],
  hasVisualizer: true,
  summary: "Ready visualizer: add reverse-order digits, append the ones digit, and carry the tens digit to the next nodes.",
} satisfies ReadyProblemDefinition;
