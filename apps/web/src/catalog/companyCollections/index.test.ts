import { describe, expect, it } from "vitest";
import { companyCollections, getCompanyCollection } from "./index";
import { mergeProblems, problemCatalog, rankCompanyProblems } from "../problems";
import type { Problem } from "../types";

describe("company collections", () => {
  it.each(["Google", "Amazon", "TikTok"] as const)(
    "has a dated %s snapshot ordered by frequency",
    (name) => {
      const collection = getCompanyCollection(name);

      expect(collection.label).toBe(`${name} · 3 months`);
      expect(collection.snapshotAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(new Set(collection.problems.map((problem) => problem.id)).size).toBe(
        collection.problems.length,
      );
      expect(
        collection.problems.every(
          (problem, index, all) => index === 0 || all[index - 1].frequency >= problem.frequency,
        ),
      ).toBe(true);
    },
  );

  it("uses the complete official LeetCode three-month snapshots", () => {
    const expectedCounts = {
      Google: 495,
      Amazon: 472,
      TikTok: 19,
    } as const;

    for (const [name, expectedCount] of Object.entries(expectedCounts) as Array<
      [keyof typeof expectedCounts, number]
    >) {
      const collection = getCompanyCollection(name);

      expect(collection.sourceUrl).toBe(
        `https://leetcode.com/company/${name.toLowerCase()}/?favoriteSlug=${name.toLowerCase()}-three-months`,
      );
      expect(collection.problems).toHaveLength(expectedCount);
    }
  });

  it("exports all three company snapshots", () => {
    expect(companyCollections).toHaveLength(3);
  });

  it("keeps an existing visualizer while adding company collection metadata", () => {
    const readyProblem: Problem = {
      id: 1,
      title: "Two Sum",
      slug: "two-sum",
      difficulty: "Easy",
      tags: ["Array"],
      pattern: "Hash lookup",
      collections: ["Hot 150"],
      hasVisualizer: true,
      summary: "Local visualizer metadata.",
    };
    const companyEntry: Problem = {
      ...readyProblem,
      title: "Company Two Sum",
      tags: ["Company frequency"],
      collections: ["Google · 3 months"],
      companyRanks: { Google: 160 },
      hasVisualizer: false,
      summary: "Company snapshot metadata.",
    };

    expect(mergeProblems([companyEntry, readyProblem])).toEqual([
      expect.objectContaining({
        id: 1,
        title: "Two Sum",
        hasVisualizer: true,
        collections: ["Google · 3 months", "Hot 150"],
        companyRanks: { Google: 160 },
      }),
    ]);
  });

  it("creates placeholders and applies a selected company frequency order", () => {
    const google = getCompanyCollection("Google");
    const companyOnly = google.problems.find(
      (item) => problemCatalog.find((problem) => problem.id === item.id)?.hasVisualizer === false,
    );

    expect(companyOnly).toBeDefined();
    expect(problemCatalog.find((problem) => problem.id === companyOnly?.id)).toMatchObject({
      hasVisualizer: false,
      collections: expect.arrayContaining(["Google · 3 months"]),
    });

    const firstThree = rankCompanyProblems("Google · 3 months", problemCatalog).slice(0, 3);
    expect(firstThree.map((problem) => problem.companyRanks?.Google)).toEqual(
      [...firstThree.map((problem) => problem.companyRanks?.Google)].sort((left, right) => right! - left!),
    );
  });
});
