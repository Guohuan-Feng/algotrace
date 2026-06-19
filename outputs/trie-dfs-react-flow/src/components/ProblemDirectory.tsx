import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Circle, Filter, Search } from "lucide-react";
import { allTags, problemCatalog, sortedProblems } from "../problemCatalog";
import type { Problem } from "../types";

export function ProblemDirectory() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState<"All" | "Ready" | "Missing">("All");

  const visibleProblems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return sortedProblems.filter((problem) => {
      const matchesSearch =
        !normalized ||
        problem.title.toLowerCase().includes(normalized) ||
        String(problem.id).includes(normalized) ||
        problem.tags.some((problemTag) => problemTag.toLowerCase().includes(normalized)) ||
        problem.pattern.toLowerCase().includes(normalized);
      const matchesTag = tag === "All" || problem.tags.includes(tag);
      const matchesDifficulty = difficulty === "All" || problem.difficulty === difficulty;
      const matchesStatus =
        status === "All" ||
        (status === "Ready" && problem.hasVisualizer) ||
        (status === "Missing" && !problem.hasVisualizer);

      return matchesSearch && matchesTag && matchesDifficulty && matchesStatus;
    });
  }, [difficulty, query, status, tag]);

  const groupedProblems = useMemo(() => groupProblemsByFirstLetter(visibleProblems), [visibleProblems]);
  const readyCount = problemCatalog.filter((problem) => problem.hasVisualizer).length;

  return (
    <main className="catalog-shell">
      <header className="catalog-header">
        <div>
          <p className="eyebrow">Algorithm visualizer library</p>
          <h1>AlgoTrace</h1>
          <p className="catalog-subtitle">
            A growing index for algorithm dry-run animations. Ready items open a full visual trace; missing items stay in the roadmap.
          </p>
        </div>
        <div className="catalog-stats" aria-label="Catalog progress">
          <span>{problemCatalog.length} indexed</span>
          <strong>{readyCount} ready</strong>
        </div>
      </header>

      <section className="catalog-toolbar" aria-label="Problem filters">
        <label className="search-field">
          <Search size={17} />
          <input
            placeholder="Search title, id, tag, or pattern"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          <Filter size={15} />
          <select value={tag} onChange={(event) => setTag(event.target.value)}>
            <option value="All">All topics</option>
            {allTags.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Difficulty
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option value="All">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>
        <label>
          Animation
          <select value={status} onChange={(event) => setStatus(event.target.value as "All" | "Ready" | "Missing")}>
            <option value="All">All problems</option>
            <option value="Ready">Ready only</option>
            <option value="Missing">Missing only</option>
          </select>
        </label>
      </section>

      <section className="catalog-content">
        <aside className="topic-rail">
          <h2>Topics</h2>
          <button className={tag === "All" ? "topic-chip active" : "topic-chip"} onClick={() => setTag("All")}>
            All
          </button>
          {allTags.map((item) => (
            <button
              className={tag === item ? "topic-chip active" : "topic-chip"}
              key={item}
              onClick={() => setTag(item)}
            >
              {item}
            </button>
          ))}
        </aside>

        <div className="problem-groups">
          {Object.entries(groupedProblems).map(([letter, problems]) => (
            <section className="letter-group" key={letter}>
              <div className="letter-heading">{letter}</div>
              <div className="problem-list">
                {problems.map((problem) => (
                  <a className="problem-row" href={`#/problems/${problem.slug}`} key={problem.slug}>
                    <div className="problem-main">
                      <span className="problem-id">#{problem.id}</span>
                      <div>
                        <h2>{problem.title}</h2>
                        <p>{problem.summary}</p>
                      </div>
                    </div>
                    <div className="problem-meta">
                      <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
                      <span className={problem.hasVisualizer ? "status ready" : "status missing"}>
                        {problem.hasVisualizer ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                        {problem.hasVisualizer ? "已有动画" : "待补动画"}
                      </span>
                    </div>
                    <div className="tag-list">
                      {problem.tags.map((problemTag) => (
                        <span key={problemTag}>{problemTag}</span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}

          {!visibleProblems.length ? (
            <div className="empty-state">
              <BookOpen size={24} />
              <h2>No matching problems</h2>
              <p>Try clearing the filters or choosing a broader topic.</p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function groupProblemsByFirstLetter(problems: Problem[]): Record<string, Problem[]> {
  return problems.reduce<Record<string, Problem[]>>((groups, problem) => {
    const letter = problem.title[0].toUpperCase();
    groups[letter] = groups[letter] ? [...groups[letter], problem] : [problem];
    return groups;
  }, {});
}
