# Company Collections and Cross-Device Progress Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add versioned Google, Amazon, and TikTok three-month company collections to AlgoTrace, with Google-authenticated, cross-device completion tracking.

**Architecture:** Company rankings are checked-in snapshots generated from a public Markdown data source, so the browser never scrapes LeetCode or GitHub. The catalog unions company collection labels with the existing local definitions, preserving a local visualizer whenever one exists. An auth provider owns Supabase session restoration, the completed-ID set, and all progress mutations; the directory consumes that provider through a small hook.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, Testing Library, Supabase JS, GitHub Actions, Supabase SQL migrations, Vercel.

## Global Constraints

- Use `Google · 3 months`, `Amazon · 3 months`, and `TikTok · 3 months` as collection labels.
- Company ordering is descending frequency, then ascending LeetCode ID for ties; render it only inside a selected company collection.
- The application never fetches LeetCode or GitHub at page load and never claims snapshot data is real-time.
- Keep existing problem metadata and `hasVisualizer: true` authoritative for duplicate problem IDs.
- Do not hardcode an email address, browser session, Supabase secret, OAuth client secret, or service-role key.
- The leading completion button must be separate from the row anchor and must not navigate when clicked.
- Do not save Supabase provider settings or Vercel environment variables without user confirmation in the relevant dashboard.

---

## File Structure

- Create `apps/web/src/catalog/companyCollections/types.ts`: source snapshot and ranked company-problem types.
- Create `apps/web/src/catalog/companyCollections/index.ts`: three frozen snapshots plus lookup/ordering helpers.
- Create `apps/web/scripts/refreshCompanyCollections.mjs`: parses source Markdown, validates records, and writes deterministic snapshot modules.
- Create `apps/web/src/catalog/companyCollections/index.test.ts`: collection IDs, rank ordering, source timestamps, and merge tests.
- Modify `apps/web/src/catalog/types.ts`: add optional company rank/source fields.
- Modify `apps/web/src/catalog/problems.ts`: merge roadmap, visualizer, and company metadata without dropping local readiness.
- Create `apps/web/src/auth/supabase.ts`: configured-or-null browser Supabase client.
- Create `apps/web/src/auth/progressRepository.ts`: typed load/insert/delete operations against `problem_progress`.
- Create `apps/web/src/auth/ProgressProvider.tsx`: auth session, pending anonymous toggle, optimized completion state, and error handling.
- Create `apps/web/src/auth/ProgressProvider.test.tsx`: loading, optimistic mutation, rollback, and deferred anonymous toggle tests.
- Modify `apps/web/src/app/App.tsx`: wrap all routes in the progress provider.
- Modify `apps/web/src/shared/components/ProblemDirectory.tsx`: account control, completion filter/count, company ordering, and non-navigating row button.
- Create `apps/web/src/shared/components/ProblemDirectory.test.tsx`: accessibility, filtering, ordering, count, and event-behavior coverage.
- Modify `apps/web/src/app/styles.css`: light-theme account/completion controls and responsive directory-row layout.
- Create `supabase/migrations/20260904000000_problem_progress.sql`: table, index, RLS, and owner-only policies.
- Create `.github/workflows/refresh-company-collections.yml`: daily snapshot validation and commit-if-changed workflow.
- Modify `README.md`: snapshot provenance, non-real-time expectation, Supabase/Vercel setup, migration, and verification instructions.

### Task 1: Build a Deterministic Company Snapshot Pipeline

**Files:**
- Create: `apps/web/src/catalog/companyCollections/types.ts`
- Create: `apps/web/src/catalog/companyCollections/index.ts`
- Create: `apps/web/scripts/refreshCompanyCollections.mjs`
- Test: `apps/web/src/catalog/companyCollections/index.test.ts`
- Modify: `apps/web/package.json`

**Interfaces:**
- Produces `CompanyName`, `CompanyCollection`, `CompanyProblem`, `companyCollections`, `getCompanyCollection(name)`, and `rankCompanyProblems(collection, catalog)`.
- `CompanyProblem` is `{ id: number; title: string; difficulty: Difficulty; frequency: number; sourceUrl: string }`.
- `CompanyCollection` is `{ name: CompanyName; label: string; snapshotAt: string; sourceUrl: string; problems: readonly CompanyProblem[] }`.

- [ ] **Step 1: Write failing snapshot tests**

```ts
import { describe, expect, it } from "vitest";
import { companyCollections, getCompanyCollection } from "./index";

describe("company collections", () => {
  it.each(["Google", "Amazon", "TikTok"] as const)("has a dated %s snapshot ordered by frequency", (name) => {
    const collection = getCompanyCollection(name);
    expect(collection.label).toBe(`${name} · 3 months`);
    expect(collection.snapshotAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(new Set(collection.problems.map((problem) => problem.id)).size).toBe(collection.problems.length);
    expect(collection.problems.every((problem, index, all) => index === 0 || all[index - 1].frequency >= problem.frequency)).toBe(true);
  });

  it("exports all three company snapshots", () => expect(companyCollections).toHaveLength(3));
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `pnpm --dir apps/web test src/catalog/companyCollections/index.test.ts`

Expected: FAIL because the snapshot module does not exist.

- [ ] **Step 3: Implement source types, static snapshots, and ordered lookup**

```ts
export type CompanyName = "Google" | "Amazon" | "TikTok";
export type CompanyProblem = { id: number; title: string; difficulty: Difficulty; frequency: number; sourceUrl: string };
export type CompanyCollection = { name: CompanyName; label: string; snapshotAt: string; sourceUrl: string; problems: readonly CompanyProblem[] };

export const getCompanyCollection = (name: CompanyName) =>
  companyCollections.find((collection) => collection.name === name)!;
```

Implement `refreshCompanyCollections.mjs` to request exactly `google.md`, `amazon.md`, and `tiktok.md` from `dr-o-ne/leetcode-company-problem-frequency`, parse Markdown rows, retain only `0 - 3 months`, extract numeric IDs from `Link`, reject missing/duplicate IDs or unknown difficulty, sort by `frequency DESC, id ASC`, and write deterministic TypeScript source. Add `refresh:company-collections` to `apps/web/package.json`.

- [ ] **Step 4: Run the parser and tests**

Run: `pnpm --dir apps/web refresh:company-collections && pnpm --dir apps/web test src/catalog/companyCollections/index.test.ts`

Expected: PASS; three dated snapshots contain only unique IDs in stable rank order.

- [ ] **Step 5: Commit**

```bash
git add apps/web/package.json apps/web/scripts/refreshCompanyCollections.mjs apps/web/src/catalog/companyCollections
git commit -m "feat: add versioned company collection snapshots"
```

### Task 2: Merge Company Entries Without Losing Visualizers

**Files:**
- Modify: `apps/web/src/catalog/types.ts`
- Modify: `apps/web/src/catalog/problems.ts`
- Modify: `apps/web/src/catalog/companyCollections/index.ts`
- Test: `apps/web/src/catalog/companyCollections/index.test.ts`

**Interfaces:**
- `Problem.companyRanks?: Partial<Record<CompanyName, number>>` records per-company frequency.
- `mergeProblems(problems: readonly Problem[]): Problem[]` keeps local `hasVisualizer`, local title/tags/pattern/summary, and unions `collections` and `companyRanks`.
- `rankCompanyProblems(collection: string, problems: readonly Problem[]): Problem[]` preserves global numeric sort otherwise and applies frequency ordering for company collection labels.

- [ ] **Step 1: Extend the test with duplicate and placeholder cases**

```ts
it("keeps an existing visualizer while adding company collection metadata", () => {
  const merged = mergeProblems([readyProblem, companyOnlyEntryForSameId]);
  expect(merged[0]).toMatchObject({ id: readyProblem.id, hasVisualizer: true, collections: expect.arrayContaining(["Google · 3 months"]) });
});

it("creates a no-visualizer placeholder for a company-only entry", () => {
  expect(problemCatalog.find((problem) => problem.id === companyOnlyId)).toMatchObject({ hasVisualizer: false });
});
```

- [ ] **Step 2: Run the focused catalog tests to verify they fail**

Run: `pnpm --dir apps/web test src/catalog/companyCollections/index.test.ts src/problems/index.test.ts`

Expected: FAIL because last-write-wins drops local visualizer metadata and no company placeholders exist.

- [ ] **Step 3: Implement union merge and rank selection**

```ts
const companyProblemToCatalogProblem = (company: CompanyCollection, item: CompanyProblem): Problem => ({
  id: item.id,
  title: item.title,
  slug: slugify(item.title),
  difficulty: item.difficulty,
  tags: ["Company frequency"],
  pattern: "Company collection",
  collections: [company.label],
  companyRanks: { [company.name]: item.frequency },
  hasVisualizer: false,
  summary: `Ranked ${item.frequency} times in the ${company.label} snapshot.`,
});
```

Use a field-aware merge instead of `Map#set` replacement: OR `hasVisualizer`, union strings, prefer a ready/local definition for stable title/slug/content, and merge rank objects. Export `mergeProblems` for tests.

- [ ] **Step 4: Run catalog tests and production typecheck**

Run: `pnpm --dir apps/web test src/catalog/companyCollections/index.test.ts src/problems/index.test.ts && pnpm --dir apps/web build`

Expected: PASS; current visualizer count is not reduced and every company item appears once.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/catalog/types.ts apps/web/src/catalog/problems.ts apps/web/src/catalog/companyCollections
git commit -m "feat: merge company collections into catalog"
```

### Task 3: Add Auth-Owned Progress State and Supabase Repository

**Files:**
- Create: `apps/web/src/auth/supabase.ts`
- Create: `apps/web/src/auth/progressRepository.ts`
- Create: `apps/web/src/auth/ProgressProvider.tsx`
- Create: `apps/web/src/auth/ProgressProvider.test.tsx`
- Modify: `apps/web/src/app/App.tsx`
- Modify: `apps/web/package.json`

**Interfaces:**
- `ProgressRepository` exposes `load(userId): Promise<Set<number>>`, `mark(userId, problemId): Promise<void>`, and `unmark(userId, problemId): Promise<void>`.
- `ProgressContextValue` exposes `{ authState: "loading" | "anonymous" | "authenticated"; user: User | null; completedIds: ReadonlySet<number>; error: string | null; signIn(): Promise<void>; signOut(): Promise<void>; toggleCompletion(problemId: number): Promise<void> }`.
- `useProgress()` throws outside `ProgressProvider`.

- [ ] **Step 1: Write failing provider/repository tests**

```tsx
it("defers an anonymous completion until Google sign-in resolves", async () => {
  render(<ProgressProvider repository={repository}><Toggle problemId={4} /></ProgressProvider>);
  await userEvent.click(screen.getByRole("button", { name: /mark 4 complete/i }));
  expect(repository.signInWithGoogle).toHaveBeenCalledOnce();
  await resolveSignedInUser();
  expect(repository.mark).toHaveBeenCalledWith("user-1", 4);
});

it("reverts an optimistic completion after a failed write", async () => {
  repository.mark.mockRejectedValueOnce(new Error("offline"));
  await userEvent.click(screen.getByRole("button", { name: /mark 4 complete/i }));
  expect(screen.getByRole("button", { name: /mark 4 complete/i })).not.toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("alert")).toHaveTextContent(/could not sync/i);
});
```

- [ ] **Step 2: Run the provider test to verify it fails**

Run: `pnpm --dir apps/web test src/auth/ProgressProvider.test.tsx`

Expected: FAIL because auth modules and `@supabase/supabase-js` are missing.

- [ ] **Step 3: Install the browser client and implement the unconfigured-safe provider**

```ts
const supabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  ? createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
  : null;

await supabase?.auth.signInWithOAuth({
  provider: "google",
  options: { redirectTo: window.location.origin },
});
```

Subscribe to `onAuthStateChange`, load progress after session resolution, preserve one pending anonymous problem ID during the OAuth redirect, optimistically toggle only for authenticated users, and rollback on repository failure. In an unconfigured build show an actionable directory error and leave completion controls disabled; do not fabricate local sync.

- [ ] **Step 4: Run auth tests and build**

Run: `pnpm --dir apps/web test src/auth/ProgressProvider.test.tsx && pnpm --dir apps/web build`

Expected: PASS; a build with no Supabase variables renders safely.

- [ ] **Step 5: Commit**

```bash
git add apps/web/package.json apps/web/pnpm-lock.yaml apps/web/src/auth apps/web/src/app/App.tsx
git commit -m "feat: add Google-authenticated problem progress"
```

### Task 4: Build the Directory Completion Experience

**Files:**
- Modify: `apps/web/src/shared/components/ProblemDirectory.tsx`
- Create: `apps/web/src/shared/components/ProblemDirectory.test.tsx`
- Modify: `apps/web/src/app/styles.css`

**Interfaces:**
- Consumes `useProgress()` and `rankCompanyProblems()`.
- Adds `completion: "All" | "Completed" | "Not completed"` to local filters.
- Renders `button.problem-completion` with `aria-pressed` and name `Mark #${id} complete` or `Mark #${id} incomplete`.

- [ ] **Step 1: Write failing directory tests**

```tsx
it("renders a leading completion button that does not navigate", async () => {
  renderDirectory();
  const control = screen.getByRole("button", { name: /mark #4 complete/i });
  await userEvent.click(control);
  expect(window.location.hash).toBe("");
  expect(screen.getByRole("button", { name: /mark #4 incomplete/i })).toHaveAttribute("aria-pressed", "true");
});

it("shows progress and frequency order for a selected company", async () => {
  renderDirectory({ completedIds: new Set([4]) });
  await userEvent.selectOptions(screen.getByLabelText("List"), "Google · 3 months");
  expect(screen.getByLabelText("Google · 3 months progress")).toHaveTextContent(/1\s*\/\s*\d+/);
  expect(problemIdsInRows()).toEqual(rankCompanyProblems("Google · 3 months", problemCatalog).map(({ id }) => id));
});
```

- [ ] **Step 2: Run the directory test to verify it fails**

Run: `pnpm --dir apps/web test src/shared/components/ProblemDirectory.test.tsx`

Expected: FAIL because rows are anchors, no completion filter exists, and company ordering/count are absent.

- [ ] **Step 3: Refactor a row into sibling controls and implement all filters**

```tsx
<article className="problem-row" key={problem.id}>
  <button
    className="problem-completion"
    aria-pressed={completed}
    aria-label={`Mark #${problem.id} ${completed ? "incomplete" : "complete"}`}
    disabled={authState === "loading" || progressUnavailable}
    onClick={() => void toggleCompletion(problem.id)}
  >
    {completed ? <Check size={15} /> : <Circle size={15} />}
  </button>
  <a className="problem-link" href={`#/problems/${problem.slug}`}>...</a>
</article>
```

Add an `AccountControl`, `Completion` selector, company-only progress count, snapshot timestamp/source disclosure, and a company selection rail. Use `rankCompanyProblems` only after filtering a selected company. Keep status/ready filters and all existing title routes intact.

- [ ] **Step 4: Implement light, responsive styling**

```css
.problem-row { display: grid; grid-template-columns: 2.5rem minmax(0, 1fr); }
.problem-completion { inline-size: 2rem; block-size: 2rem; border-radius: 999px; }
.problem-completion[aria-pressed="true"] { color: var(--success); background: var(--success-soft); }
@media (max-width: 720px) { .problem-row { grid-template-columns: 2.25rem minmax(0, 1fr); } }
```

Use focus-visible outlines, at least 44px hit targets via padding, and prevent text/metadata overflow on narrow rows.

- [ ] **Step 5: Run focused UI tests and build**

Run: `pnpm --dir apps/web test src/shared/components/ProblemDirectory.test.tsx src/auth/ProgressProvider.test.tsx && pnpm --dir apps/web build`

Expected: PASS; row controls remain independent and all new filters work.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/shared/components/ProblemDirectory.tsx apps/web/src/shared/components/ProblemDirectory.test.tsx apps/web/src/app/styles.css
git commit -m "feat: add company progress controls to directory"
```

### Task 5: Add Cloud Schema, Daily Refresh, Documentation, and Verification

**Files:**
- Create: `supabase/migrations/20260904000000_problem_progress.sql`
- Create: `.github/workflows/refresh-company-collections.yml`
- Modify: `README.md`

**Interfaces:**
- SQL defines `public.problem_progress(user_id uuid, problem_id integer, completed_at timestamptz)` with `(user_id, problem_id)` primary key.
- Workflow runs `pnpm --dir apps/web refresh:company-collections`, tests generated snapshots, and commits only tracked snapshot changes.

- [ ] **Step 1: Write the migration and validate its policy shape locally**

```sql
create table public.problem_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id integer not null check (problem_id > 0),
  completed_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, problem_id)
);
alter table public.problem_progress enable row level security;
create policy "Users manage their own problem progress" on public.problem_progress
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
```

- [ ] **Step 2: Add the guarded refresh workflow**

```yaml
on:
  schedule: [{ cron: "17 4 * * *" }]
  workflow_dispatch:
jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm --dir apps/web install --frozen-lockfile
      - run: pnpm --dir apps/web refresh:company-collections
      - run: pnpm --dir apps/web test src/catalog/companyCollections/index.test.ts
      - uses: stefanzweifel/git-auto-commit-action@v5
        with: { commit_message: "chore: refresh company collection snapshots" }
```

Make the parser exit non-zero before writing files for missing periods, no rows, malformed links, nonnumeric IDs, duplicate IDs, or unknown difficulties. The workflow then retains the last known-good snapshot.

- [ ] **Step 3: Document manual configuration and limits**

Add exact `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` instructions, SQL migration application, Google provider/redirect URLs (`http://127.0.0.1:5173` and the Vercel production URL), and a note that user confirmation is required before saving dashboard configuration. Explain that snapshots are GitHub-source-based, versioned, and not real-time.

- [ ] **Step 4: Run repository checks**

Run: `pnpm --dir apps/web test && pnpm --dir apps/web build && git diff --check`

Expected: PASS with no whitespace errors.

- [ ] **Step 5: Start local browser verification**

Run: `pnpm --dir apps/web dev -- --port 5291`

Expected: Vite serves `http://127.0.0.1:5291`.

Verify manually or with the browser tool: Google/Amazon/TikTok selection, descending frequency order, search/filter interaction, sign-in entry point, unconfigured state, completed/not-completed filtering, no anchor navigation from a completion click, desktop and mobile layouts. After the user confirms dashboard configuration, authenticate in two browser sessions and confirm a completion syncs.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations .github/workflows/refresh-company-collections.yml README.md
git commit -m "chore: document company collection sync infrastructure"
```

## Self-Review

- **Spec coverage:** Tasks 1-2 implement all three dated, frequency-ranked snapshots and catalog-safe merging; Tasks 3-4 implement Google OAuth, owner-scoped completion mutations, anonymous deferred completion, row controls, filters, and counts; Task 5 implements RLS, daily source refresh, configuration documentation, build/test/browser verification, and two-session verification after explicit dashboard approval.
- **Placeholder scan:** No `TODO`, `TBD`, or unspecified testing steps remain. External dashboard operations are intentionally gated by user confirmation because provider creation and Vercel variable writes change cloud state.
- **Type consistency:** `CompanyName`, `CompanyCollection`, `CompanyProblem`, `mergeProblems`, `rankCompanyProblems`, `ProgressRepository`, and `useProgress` are defined before their consumers and use the same names throughout.
