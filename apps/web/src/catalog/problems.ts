import { readyProblems } from "../problems";
import { companyCollections, type CompanyCollection, type CompanyName } from "./companyCollections";
import { hot150Problems } from "./hot150";
import { additionalRoadmapProblems } from "./roadmap";
import type { Problem } from "./types";

export const problemCatalog = mergeProblems([
  ...companyCollections.flatMap(companyCollectionToProblems),
  ...hot150Problems,
  ...additionalRoadmapProblems,
  ...readyProblems,
]);

export const sortedProblems = [...problemCatalog].sort((a, b) => a.id - b.id);

export const allTags = Array.from(new Set(problemCatalog.flatMap((problem) => problem.tags))).sort();

export const allCollections = Array.from(
  new Set(problemCatalog.flatMap((problem) => problem.collections ?? [])),
).sort();

export function mergeProblems(problems: readonly Problem[]): Problem[] {
  const byId = new Map<number, Problem>();

  for (const problem of problems) {
    const previous = byId.get(problem.id);

    if (!previous) {
      byId.set(problem.id, problem);
      continue;
    }

    byId.set(problem.id, {
      ...previous,
      ...problem,
      collections: unionStrings(previous.collections, problem.collections),
      tags: unionStrings(previous.tags, problem.tags),
      companyRanks: { ...previous.companyRanks, ...problem.companyRanks },
      hasVisualizer: previous.hasVisualizer || problem.hasVisualizer,
    });
  }

  return [...byId.values()];
}

export function rankCompanyProblems(collection: string, problems: readonly Problem[]): Problem[] {
  const company = companyCollections.find((item) => item.label === collection);

  if (!company) {
    return [...problems].sort((left, right) => left.id - right.id);
  }

  return problems
    .filter((problem) => problem.collections?.includes(company.label))
    .sort((left, right) => {
      const frequencyDifference = (right.companyRanks?.[company.name] ?? 0) - (left.companyRanks?.[company.name] ?? 0);
      return frequencyDifference || left.id - right.id;
    });
}

function companyCollectionToProblems(collection: CompanyCollection): Problem[] {
  return collection.problems.map((problem) => ({
    id: problem.id,
    title: problem.title,
    slug: slugFromSourceUrl(problem.sourceUrl),
    difficulty: problem.difficulty,
    tags: ["Company frequency"],
    pattern: "Company collection",
    collections: [collection.label],
    companyRanks: { [collection.name]: problem.frequency } as Partial<Record<CompanyName, number>>,
    hasVisualizer: false,
    summary: `Ranked ${problem.frequency} times in the ${collection.label} snapshot.`,
  }));
}

function slugFromSourceUrl(sourceUrl: string): string {
  const segments = new URL(sourceUrl).pathname.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "unknown-problem";
}

function unionStrings(left: readonly string[] | undefined, right: readonly string[] | undefined): string[] {
  return Array.from(new Set([...(left ?? []), ...(right ?? [])])).sort();
}
