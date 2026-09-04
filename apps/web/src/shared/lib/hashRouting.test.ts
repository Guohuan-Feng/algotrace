import { afterEach, describe, expect, it } from "vitest";
import { getCatalogRouteFromHash, navigateToCompanyCollection } from "./hashRouting";

afterEach(() => {
  window.location.hash = "";
});

describe("catalog hash routing", () => {
  it("recognizes the three dedicated company collection routes", () => {
    window.location.hash = "#/collections/google";
    expect(getCatalogRouteFromHash()).toEqual({ kind: "company", name: "Google" });

    window.location.hash = "#/collections/amazon";
    expect(getCatalogRouteFromHash()).toEqual({ kind: "company", name: "Amazon" });

    window.location.hash = "#/collections/tiktok";
    expect(getCatalogRouteFromHash()).toEqual({ kind: "company", name: "TikTok" });
  });

  it("navigates to a company collection with a stable URL", () => {
    navigateToCompanyCollection("TikTok");
    expect(window.location.hash).toBe("#/collections/tiktok");
  });
});
