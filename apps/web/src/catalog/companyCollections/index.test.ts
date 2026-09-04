import { describe, expect, it } from "vitest";
import { companyCollections, getCompanyCollection } from "./index";

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

  it("exports all three company snapshots", () => {
    expect(companyCollections).toHaveLength(3);
  });
});
