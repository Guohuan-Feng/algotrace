import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 71,
  title: "Simplify Path",
  cnTitle: "简化路径",
  slug: "simplify-path",
  difficulty: "Medium",
  tags: ["String", "Stack"],
  pattern: "Canonical directory stack",
  collections: ["Stack"],
  hasVisualizer: true,
  summary: "Ready visualizer: normalize each path segment with a directory stack and canonical slash joining.",
} satisfies ReadyProblemDefinition;
