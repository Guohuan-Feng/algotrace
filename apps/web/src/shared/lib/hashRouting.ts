export function getProblemSlugFromHash(): string | null {
  const match = window.location.hash.match(/^#\/problems\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function navigateToCatalog() {
  window.location.hash = "#/";
}
