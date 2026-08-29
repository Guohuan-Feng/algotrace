import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 70,
  title: "Climbing Stairs",
  cnTitle: "爬楼梯",
  slug: "climbing-stairs",
  difficulty: "Easy",
  tags: ["Math", "Dynamic Programming", "Memoization"],
  pattern: "Fibonacci-style dynamic programming",
  collections: ["Dynamic Programming"],
  hasVisualizer: true,
  summary: "Ready visualizer: start with the submitted one- and two-step base cases, then add the previous two counts.",
} satisfies ReadyProblemDefinition;
