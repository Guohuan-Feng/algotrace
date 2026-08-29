import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 394,
  title: "Decode String",
  cnTitle: "字符串解码",
  slug: "decode-string",
  difficulty: "Medium",
  tags: ["String", "Stack", "Recursion"],
  pattern: "Nested prefix and multiplier stack",
  collections: ["Stack"],
  hasVisualizer: true,
  summary: "Ready visualizer: preserve the outer prefix and repeat count at every opening bracket, then expand it when the matching bracket closes.",
} satisfies ReadyProblemDefinition;
