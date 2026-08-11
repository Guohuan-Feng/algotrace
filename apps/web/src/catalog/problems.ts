import { readyProblems } from "../problems";
import { hot150Problems } from "./hot150";
import { additionalRoadmapProblems } from "./roadmap";
import type { Problem } from "./types";

export const problemCatalog = mergeProblems([
  ...hot150Problems,
  ...additionalRoadmapProblems,
  ...readyProblems,
]);

export const sortedProblems = [...problemCatalog].sort((a, b) => a.id - b.id);

export const allTags = Array.from(new Set(problemCatalog.flatMap((problem) => problem.tags))).sort();

export const allCollections = Array.from(
  new Set(problemCatalog.flatMap((problem) => problem.collections ?? [])),
).sort();

function mergeProblems(problems: Problem[]): Problem[] {
  const byId = new Map<number, Problem>();
  problems.forEach((problem) => byId.set(problem.id, problem));
  return [...byId.values()];
}
