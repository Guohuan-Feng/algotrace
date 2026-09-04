import type { CompanyName } from "../../catalog/companyCollections";

export type CatalogRoute =
  | { kind: "catalog" }
  | { kind: "company"; name: CompanyName };

const companyRouteNames: Record<string, CompanyName> = {
  amazon: "Amazon",
  google: "Google",
  tiktok: "TikTok",
};

export function getProblemSlugFromHash(): string | null {
  const match = window.location.hash.match(/^#\/problems\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function getCatalogRouteFromHash(): CatalogRoute {
  const match = window.location.hash.match(/^#\/collections\/(amazon|google|tiktok)$/);
  const name = match ? companyRouteNames[match[1]] : undefined;

  return name ? { kind: "company", name } : { kind: "catalog" };
}

export function navigateToCatalog() {
  window.location.hash = "#/";
}

export function navigateToCompanyCollection(name: CompanyName) {
  window.location.hash = `#/collections/${name.toLowerCase()}`;
}
