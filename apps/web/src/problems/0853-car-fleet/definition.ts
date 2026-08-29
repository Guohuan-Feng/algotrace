import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 853,
  title: "Car Fleet",
  cnTitle: "车队",
  slug: "car-fleet",
  difficulty: "Medium",
  tags: ["Array", "Stack", "Sorting", "Monotonic Stack"],
  pattern: "Reverse-sorted arrival-time stack",
  collections: ["Stack"],
  hasVisualizer: true,
  summary: "Ready visualizer: scan cars from the target backward and merge every car that catches the fleet ahead.",
} satisfies ReadyProblemDefinition;
