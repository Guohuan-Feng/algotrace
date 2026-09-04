import { companyCollectionSnapshots } from "./snapshots.generated";
import type { CompanyCollection, CompanyName } from "./types";

export type { CompanyCollection, CompanyName, CompanyProblem } from "./types";

export const companyCollections: readonly CompanyCollection[] = companyCollectionSnapshots;

export function getCompanyCollection(name: CompanyName): CompanyCollection {
  const collection = companyCollections.find((item) => item.name === name);

  if (!collection) {
    throw new Error(`Unknown company collection: ${name}`);
  }

  return collection;
}
