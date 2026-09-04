import { Suspense, useEffect, useState } from "react";
import { problemCatalog } from "../catalog/problems";
import { getVisualizerBySlug } from "../problems";
import { ProblemDirectory } from "../shared/components/ProblemDirectory";
import { ProblemPlaceholder } from "../shared/components/ProblemPlaceholder";
import { getProblemSlugFromHash, navigateToCatalog } from "../shared/lib/hashRouting";
import { ProgressProvider } from "../auth/ProgressProvider";
import type { Problem } from "../catalog/types";

export default function App() {
  const [activeSlug, setActiveSlug] = useState(getProblemSlugFromHash);
  const activeProblem = activeSlug
    ? problemCatalog.find((problem) => problem.slug === activeSlug)
    : null;

  useEffect(() => {
    const onHashChange = () => setActiveSlug(getProblemSlugFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const page = !activeProblem
    ? <ProblemDirectory />
    : renderProblem(activeProblem);

  return <ProgressProvider>{page}</ProgressProvider>;
}

function renderProblem(activeProblem: Problem) {
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
