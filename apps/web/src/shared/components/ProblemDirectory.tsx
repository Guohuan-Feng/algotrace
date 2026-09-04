import { useMemo, useState } from "react";
import { BookOpen, Check, CheckCircle2, Circle, Filter, LogIn, LogOut, Search } from "lucide-react";
import { useProgress } from "../../auth/ProgressProvider";
import { companyCollections } from "../../catalog/companyCollections";
import { problemCatalog, rankCompanyProblems } from "../../catalog/problems";
import type { Problem } from "../../catalog/types";

type CompletionFilter = "All" | "Completed" | "Not completed";
type AnimationFilter = "All" | "Ready" | "Missing";

export function ProblemDirectory({ problems = problemCatalog }: { problems?: readonly Problem[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState<AnimationFilter>("All");
  const [completion, setCompletion] = useState<CompletionFilter>("All");
  const [collection, setCollection] = useState("All");
  const { authState, completedIds, error, signIn, signOut, toggleCompletion, user } = useProgress();

  const sortedProblems = useMemo(() => [...problems].sort((left, right) => left.id - right.id), [problems]);
  const allTags = useMemo(
    () => Array.from(new Set(problems.flatMap((problem) => problem.tags))).sort(),
    [problems],
  );
  const allCollections = useMemo(
    () => Array.from(new Set(problems.flatMap((problem) => problem.collections ?? []))).sort(),
    [problems],
  );
  const selectedCompany = companyCollections.find((item) => item.label === collection);
  const visibleProblems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = sortedProblems.filter((problem) => {
      const matchesSearch =
        !normalized ||
        problem.title.toLowerCase().includes(normalized) ||
        Boolean(problem.cnTitle?.toLowerCase().includes(normalized)) ||
        String(problem.id).includes(normalized) ||
        problem.tags.some((problemTag) => problemTag.toLowerCase().includes(normalized)) ||
        Boolean(problem.collections?.some((problemCollection) => problemCollection.toLowerCase().includes(normalized))) ||
        problem.pattern.toLowerCase().includes(normalized);
      const matchesTag = tag === "All" || problem.tags.includes(tag);
      const matchesDifficulty = difficulty === "All" || problem.difficulty === difficulty;
      const matchesStatus =
        status === "All" ||
        (status === "Ready" && problem.hasVisualizer) ||
        (status === "Missing" && !problem.hasVisualizer);
      const matchesCompletion =
        completion === "All" ||
        (completion === "Completed" && completedIds.has(problem.id)) ||
        (completion === "Not completed" && !completedIds.has(problem.id));
      const matchesCollection = collection === "All" || Boolean(problem.collections?.includes(collection));

      return matchesSearch && matchesTag && matchesDifficulty && matchesStatus && matchesCompletion && matchesCollection;
    });

    return rankCompanyProblems(collection, filtered);
  }, [collection, completedIds, completion, difficulty, query, status, tag]);

  const readyCount = problems.filter((problem) => problem.hasVisualizer).length;
  const selectedCompanyProblems = selectedCompany
    ? problems.filter((problem) => problem.collections?.includes(selectedCompany.label))
    : [];
  const selectedCompanyCompleted = selectedCompanyProblems.filter((problem) => completedIds.has(problem.id)).length;
  const completionDisabled = authState === "loading" || authState === "unconfigured";

  return (
    <main className="catalog-shell">
      <header className="catalog-header">
        <div>
          <p className="eyebrow">Algorithm visualizer library</p>
          <h1>AlgoTrace</h1>
          <p className="catalog-subtitle">
            A growing index for algorithm dry-run animations. Ready items open a full visual trace; missing items stay in the roadmap.
          </p>
          {error ? <p className="catalog-error" role="alert">{error}</p> : null}
        </div>
        <div className="catalog-actions">
          <AccountControl authState={authState} userName={user?.name ?? user?.email} onSignIn={signIn} onSignOut={signOut} />
          <div className="catalog-stats" aria-label="Catalog progress">
            <span>{problems.length} indexed</span>
            <strong>{readyCount} ready</strong>
          </div>
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
          <select aria-label="Topic" value={tag} onChange={(event) => setTag(event.target.value)}>
            <option value="All">All topics</option>
            {allTags.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Difficulty
          <select aria-label="Difficulty" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option value="All">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>
        <label>
          Animation
          <select aria-label="Animation" value={status} onChange={(event) => setStatus(event.target.value as AnimationFilter)}>
            <option value="All">All problems</option>
            <option value="Ready">Ready only</option>
            <option value="Missing">Missing only</option>
          </select>
        </label>
        <label>
          Completion
          <select aria-label="Completion" value={completion} onChange={(event) => setCompletion(event.target.value as CompletionFilter)}>
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Not completed">Not completed</option>
          </select>
        </label>
        <label>
          List
          <select aria-label="List" value={collection} onChange={(event) => setCollection(event.target.value)}>
            <option value="All">All lists</option>
            {allCollections.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
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
          <div className="rail-divider" />
          <h2>Lists</h2>
          <button className={collection === "All" ? "topic-chip active" : "topic-chip"} onClick={() => setCollection("All")}>
            All lists
          </button>
          {allCollections.map((item) => (
            <button
              className={collection === item ? "topic-chip active" : "topic-chip"}
              key={item}
              onClick={() => setCollection(item)}
            >
              {item}
            </button>
          ))}
        </aside>

        <div className="problem-groups">
          <section className="letter-group">
            <div className="directory-heading">
              <div className="letter-heading">{selectedCompany ? `${selectedCompany.label} frequency ranking` : "Problem number"}</div>
              {selectedCompany ? (
                <div className="company-directory-meta">
                  <strong aria-label={`${selectedCompany.label} progress`}>
                    {selectedCompanyCompleted} / {selectedCompanyProblems.length} completed
                  </strong>
                  <span>
                    Snapshot {new Date(selectedCompany.snapshotAt).toLocaleDateString()} · {" "}
                    <a href={selectedCompany.sourceUrl} target="_blank" rel="noreferrer">source</a>
                  </span>
                </div>
              ) : null}
            </div>
            <div className="problem-list">
              {visibleProblems.map((problem) => {
                const completed = completedIds.has(problem.id);
                const completionLabel = `Mark #${problem.id} ${completed ? "incomplete" : "complete"}`;

                return (
                  <article className="problem-row" data-problem-id={problem.id} key={problem.id}>
                    <button
                      className="problem-completion"
                      aria-label={completionLabel}
                      aria-pressed={completed}
                      disabled={completionDisabled}
                      title={completionDisabled ? "Progress sync is loading or not configured" : completionLabel}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        void toggleCompletion(problem.id);
                      }}
                    >
                      {completed ? <Check size={16} /> : <Circle size={16} />}
                    </button>
                    <a className="problem-link" href={`#/problems/${problem.slug}`}>
                      <div className="problem-main">
                        <span className="problem-id">#{problem.id}</span>
                        <div>
                          <h2>{problem.title}</h2>
                          {problem.cnTitle ? <small className="problem-cn">{problem.cnTitle}</small> : null}
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
                        {problem.collections?.map((problemCollection) => (
                          <span className="collection-tag" key={problemCollection}>{problemCollection}</span>
                        ))}
                        {problem.tags.map((problemTag) => (
                          <span key={problemTag}>{problemTag}</span>
                        ))}
                      </div>
                    </a>
                  </article>
                );
              })}
            </div>
          </section>

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

function AccountControl({
  authState,
  userName,
  onSignIn,
  onSignOut,
}: {
  authState: ReturnType<typeof useProgress>["authState"];
  userName?: string;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
}) {
  if (authState === "authenticated") {
    return (
      <div className="account-control signed-in">
        <span>{userName ?? "Signed in"}</span>
        <button onClick={() => void onSignOut()}>
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    );
  }

  const unavailable = authState === "loading" || authState === "unconfigured";
  return (
    <button
      className="account-control"
      disabled={unavailable}
      aria-busy={authState === "loading"}
      onClick={() => void onSignIn()}
    >
      <LogIn size={15} />
      {authState === "loading" ? "Loading progress" : "Sign in with Google"}
    </button>
  );
}
