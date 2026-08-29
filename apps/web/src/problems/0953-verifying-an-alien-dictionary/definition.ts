import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 953,
  title: "Verifying an Alien Dictionary",
  cnTitle: "验证外星语词典",
  slug: "verifying-an-alien-dictionary",
  difficulty: "Easy",
  tags: ["Array", "Hash Table", "String"],
  pattern: "Adjacent word comparison with custom rank",
  collections: ["Graph"],
  hasVisualizer: true,
  summary: "Ready visualizer: compare adjacent words at their first different character and handle the invalid-prefix case.",
} satisfies ReadyProblemDefinition;
