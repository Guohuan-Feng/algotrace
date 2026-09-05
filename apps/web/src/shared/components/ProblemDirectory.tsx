import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  ExternalLink,
  Filter,
  LogIn,
  LogOut,
  Search,
} from "lucide-react";
import { useProgress } from "../../auth/ProgressProvider";
import { companyCollections, getCompanyCollection, type CompanyCollection, type CompanyName } from "../../catalog/companyCollections";
import { problemCatalog, rankCompanyProblems } from "../../catalog/problems";
import type { Problem } from "../../catalog/types";

type CompletionFilter = "All" | "Completed" | "Not completed";
type AnimationFilter = "All" | "Ready" | "Missing";

type ProblemDirectoryProps = {
  problems?: readonly Problem[];
  companyName?: CompanyName;
};

const INITIAL_RENDER_LIMIT = 80;
const RENDER_INCREMENT = 80;

export function ProblemDirectory({ problems = problemCatalog, companyName }: ProblemDirectoryProps) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState<AnimationFilter>("All");
  const [completion, setCompletion] = useState<CompletionFilter>("All");
  const [collection, setCollection] = useState("All");
  const [renderLimit, setRenderLimit] = useState(INITIAL_RENDER_LIMIT);
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
  const fixedCompany = companyName ? getCompanyCollection(companyName) : undefined;
  const activeCollection = fixedCompany?.label ?? collection;
  const selectedCompany = fixedCompany ?? companyCollections.find((item) => item.label === collection);

  useEffect(() => {
    setRenderLimit(INITIAL_RENDER_LIMIT);
  }, [activeCollection, completion, difficulty, query, status, tag]);

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
      const matchesCollection = activeCollection === "All" || Boolean(problem.collections?.includes(activeCollection));

      return matchesSearch && matchesTag && matchesDifficulty && matchesStatus && matchesCompletion && matchesCollection;
    });

    return rankCompanyProblems(activeCollection, filtered);
  }, [activeCollection, completedIds, completion, difficulty, query, status, tag]);
  const renderedProblems = visibleProblems.slice(0, renderLimit);
  const remainingProblemCount = visibleProblems.length - renderedProblems.length;

  const readyCount = problems.filter((problem) => problem.hasVisualizer).length;
  const selectedCompanyProblems = selectedCompany
    ? rankCompanyProblems(selectedCompany.label, problems)
    : [];
  const selectedCompanyCompleted = selectedCompanyProblems.filter((problem) => completedIds.has(problem.id)).length;
  const completionDisabled = authState === "loading" || authState === "unconfigured";

  return (
    <main className="catalog-shell">
      <header className="catalog-header">
        <div>
          <p className="eyebrow">{fixedCompany ? `${fixedCompany.name} interview preparation` : "Algorithm visualizer library"}</p>
          <h1>{fixedCompany?.label ?? "AlgoTrace"}</h1>
          <p className="catalog-subtitle">
            {fixedCompany
              ? "LeetCode problems from the latest three-month company snapshot, ranked by reported interview frequency."
              : "A growing index for algorithm dry-run animations. Ready items open a full visual trace; missing items stay in the roadmap."}
          </p>
          <CompanyCollectionTabs activeCompany={fixedCompany?.name} />
          {error ? <p className="catalog-error" role="alert">{error}</p> : null}
        </div>
        <div className="catalog-actions">
          <AccountControl authState={authState} userName={user?.name ?? user?.email} onSignIn={signIn} onSignOut={signOut} />
          {fixedCompany ? (
            <CompanyProgressCard collection={fixedCompany} problems={selectedCompanyProblems} completedIds={completedIds} />
          ) : (
            <div className="catalog-stats" aria-label="Catalog progress">
              <span>{problems.length} indexed</span>
              <strong>{readyCount} ready</strong>
            </div>
          )}
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
        {!fixedCompany ? (
          <label>
            List
            <select aria-label="List" value={collection} onChange={(event) => setCollection(event.target.value)}>
              <option value="All">All lists</option>
              {allCollections.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
        ) : null}
      </section>

      <section className="catalog-content">
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
              <div className="problem-list-header" aria-hidden="true">
                <span />
                <span>#</span>
                <span>Title</span>
                <span>Frequency</span>
                <span>Difficulty</span>
                <span>Animation</span>
              </div>
              {renderedProblems.map((problem) => {
                const completed = completedIds.has(problem.id);
                const completionLabel = `Mark #${problem.id} ${completed ? "incomplete" : "complete"}`;
                const frequency = selectedCompany ? problem.companyRanks?.[selectedCompany.name] : undefined;

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
                    <span className="problem-id">{problem.id}</span>
                    <div className="problem-title">
                      <div className="problem-title-row">
                        <a className="problem-visualizer-link" href={`#/problems/${problem.slug}`}>
                          <h2>{problem.title}</h2>
                        </a>
                        <a
                          className="leetcode-link"
                          aria-label={`Open #${problem.id} on LeetCode`}
                          href={getLeetCodeUrl(problem)}
                          target="_blank"
                          rel="noreferrer"
                          title="Open on LeetCode"
                        >
                          <ExternalLink size={15} />
                        </a>
                      </div>
                      {problem.cnTitle ? <small className="problem-cn">{problem.cnTitle}</small> : null}
                    </div>
                    <span className="frequency-badge">{frequency === undefined ? "-" : `${frequency}`}</span>
                    <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
                    <span className={problem.hasVisualizer ? "status ready" : "status missing"}>
                      {problem.hasVisualizer ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                      {problem.hasVisualizer ? "动画" : "待补"}
                    </span>
                  </article>
                );
              })}
            </div>
            {remainingProblemCount > 0 ? (
              <button
                className="load-more-problems"
                aria-label={`Show ${remainingProblemCount} more problems`}
                onClick={() => setRenderLimit((limit) => limit + RENDER_INCREMENT)}
              >
                <ChevronDown size={16} />
                Show {Math.min(RENDER_INCREMENT, remainingProblemCount)} more
              </button>
            ) : null}
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

function getLeetCodeUrl(problem: Problem): string {
  return problem.sourceUrl ?? `https://leetcode.com/problems/${problem.slug}/`;
}

function CompanyCollectionTabs({ activeCompany }: { activeCompany?: CompanyName }) {
  return (
    <nav className="company-collection-tabs" aria-label="Company collections">
      <a className={activeCompany ? "" : "active"} href="#/">All problems</a>
      {companyCollections.map((collection) => (
        <a
          className={activeCompany === collection.name ? "active" : ""}
          href={`#/collections/${collection.name.toLowerCase()}`}
          key={collection.name}
        >
          {collection.label}
        </a>
      ))}
    </nav>
  );
}

function CompanyProgressCard({
  collection,
  problems,
  completedIds,
}: {
  collection: CompanyCollection;
  problems: readonly Problem[];
  completedIds: ReadonlySet<number>;
}) {
  const completedCount = problems.filter((problem) => completedIds.has(problem.id)).length;
  const progress = problems.length ? Math.round((completedCount / problems.length) * 100) : 0;
  const difficulties = ["Easy", "Medium", "Hard"] as const;

  return (
    <aside className="company-progress-card" aria-label={`${collection.label} solved progress`}>
      <div className="company-progress-title">
        <BarChart3 size={17} />
        <span>Progress</span>
      </div>
      <div className="company-progress-content">
        <dl className="difficulty-progress-list">
          {difficulties.map((difficulty) => {
            const total = problems.filter((problem) => problem.difficulty === difficulty).length;
            const completed = problems.filter(
              (problem) => problem.difficulty === difficulty && completedIds.has(problem.id),
            ).length;

            return (
              <div key={difficulty}>
                <dt className={difficulty.toLowerCase()}>{difficulty}</dt>
                <dd aria-label={`${difficulty} progress`}>{completed} / {total}</dd>
              </div>
            );
          })}
        </dl>
        <div
          aria-hidden="true"
          className="company-progress-ring"
          style={{ background: `conic-gradient(#00b8a3 ${progress}%, #3c3c3c 0)` }}
        >
          <div>
            <strong>{completedCount}</strong>
            <span>/ {problems.length}</span>
            <small>solved</small>
          </div>
        </div>
      </div>
      <p>{completedCount} / {problems.length} solved</p>
    </aside>
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
