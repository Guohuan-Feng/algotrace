import { Suspense, useEffect, useState } from "react";
import { ProblemDirectory } from "./components/ProblemDirectory";
import { ProblemPlaceholder } from "./components/ProblemPlaceholder";
import { getProblemSlugFromHash, navigateToCatalog } from "./lib/hashRouting";
import { problemCatalog } from "./problemCatalog";
import { visualizerRegistry } from "./problemRegistry";

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

  if (!activeProblem) {
    return <ProblemDirectory />;
  }

  if (activeProblem.visualizerKey) {
    const Visualizer = visualizerRegistry[activeProblem.visualizerKey];
    return (
      <Suspense fallback={<main className="placeholder-shell">Loading visualizer...</main>}>
        <Visualizer onBack={navigateToCatalog} />
      </Suspense>
    );
  }

  return <ProblemPlaceholder problem={activeProblem} onBack={navigateToCatalog} />;
}
