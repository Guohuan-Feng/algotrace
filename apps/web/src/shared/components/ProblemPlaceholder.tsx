import { ArrowLeft } from "lucide-react";
import type { Problem } from "../../catalog/types";

type ProblemPlaceholderProps = {
  problem: Problem;
  onBack: () => void;
};

export function ProblemPlaceholder({ problem, onBack }: ProblemPlaceholderProps) {
  return (
    <main className="placeholder-shell">
      <button className="back-link" onClick={onBack}>
        <ArrowLeft size={17} />
        Back to catalog
      </button>
      <section className="placeholder-panel">
        <p className="eyebrow">Animation not built yet</p>
        <h1>{problem.title}</h1>
        <p>{problem.summary}</p>
        <div className="placeholder-grid">
          <span>#{problem.id}</span>
          <span>{problem.difficulty}</span>
          <span>{problem.pattern}</span>
        </div>
        <div className="tag-list large">
          {problem.tags.map((problemTag) => (
            <span key={problemTag}>{problemTag}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
