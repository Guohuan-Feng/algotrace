import { Suspense, useEffect, useState } from "react";
import { problemCatalog } from "../catalog/problems";
import { getVisualizerBySlug } from "../problems";
import { ProblemDirectory } from "../shared/components/ProblemDirectory";
import { ProblemPlaceholder } from "../shared/components/ProblemPlaceholder";
import {
  getCatalogRouteFromHash,
  getProblemSlugFromHash,
  navigateToCatalog,
  type CatalogRoute,
} from "../shared/lib/hashRouting";
import { ProgressProvider } from "../auth/ProgressProvider";
import type { Problem } from "../catalog/types";

export default function App() {
  const [route, setRoute] = useState(getRouteFromHash);

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const page = route.kind === "problem"
    ? renderProblem(problemCatalog.find((problem) => problem.slug === route.slug))
    : <ProblemDirectory companyName={route.kind === "company" ? route.name : undefined} />;

  return <ProgressProvider>{page}</ProgressProvider>;
}

type AppRoute = CatalogRoute | { kind: "problem"; slug: string };

function getRouteFromHash(): AppRoute {
  const slug = getProblemSlugFromHash();
  return slug ? { kind: "problem", slug } : getCatalogRouteFromHash();
}

function renderProblem(activeProblem: Problem | undefined) {
  if (!activeProblem) {
    return <ProblemDirectory />;
  }

  const Visualizer = getVisualizerBySlug(activeProblem.slug);

  if (Visualizer) {
    return (
      <Suspense fallback={<main className="placeholder-shell">Loading visualizer...</main>}>
        <Visualizer onBack={navigateToCatalog} />
      </Suspense>
    );
  }

  return <ProblemPlaceholder problem={activeProblem} onBack={navigateToCatalog} />;
}
