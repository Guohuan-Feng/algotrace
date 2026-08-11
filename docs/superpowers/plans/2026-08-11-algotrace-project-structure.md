# AlgoTrace Project Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move AlgoTrace to a conventional application directory and make completed visualizers self-register from their own problem folders.

**Architecture:** The Vite application moves to `apps/web`. Small per-problem `definition.ts` modules are eagerly discovered for catalog metadata, while a separate Vite glob lazy-loads each `Visualizer.tsx`. Roadmap data stays centralized because it has no visualizer implementation.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, pnpm, Vercel.

## Global Constraints

- Keep existing hash routes and UI behavior unchanged.
- Keep visualizer modules lazy-loaded.
- Do not add runtime dependencies.
- Use default exports for all ready `Visualizer.tsx` modules.
- Keep the Vercel project rooted at the repository root.

---

### Task 1: Establish Auto-Discovery Contract

**Files:**
- Create: `apps/web/src/problems/index.test.ts`
- Create: `apps/web/src/problems/index.ts`
- Create: `apps/web/src/catalog/types.ts`

**Interfaces:**
- Produces `readyProblems`, `getVisualizerBySlug(slug)`, and `ReadyProblemDefinition`.
- Consumes a problem folder's default `Visualizer.tsx` export and `definition.ts` metadata.

- [ ] Write a test asserting that ready metadata includes `sqrtx`, has its ID/title, and has a lazy visualizer loader.
- [ ] Run the focused Vitest command and observe the expected module-not-found failure before the index exists.
- [ ] Implement Vite definition and visualizer globs plus a typed visualizer lookup.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Move the Application and Normalize Problem Modules

**Files:**
- Move: `outputs/trie-dfs-react-flow/` to `apps/web/`
- Modify: every `apps/web/src/problems/*/Visualizer.tsx`
- Create: every `apps/web/src/problems/*/definition.ts`

**Interfaces:**
- Each definition exports a `ReadyProblemDefinition`.
- Each visualizer has a default component export accepting `VisualizerProps`.

- [ ] Move the application without changing source contents.
- [ ] Change named visualizer exports to default exports.
- [ ] Add one metadata definition per existing visualizer folder, carrying its current ID, slug, title, difficulty, tags, collection, pattern, summary, and Chinese title.
- [ ] Run the auto-discovery test and confirm all ready modules load through the common contract.

### Task 3: Split Catalog, Shared Code, and Application Shell

**Files:**
- Move: `apps/web/src/App.tsx` to `apps/web/src/app/App.tsx`
- Move: `apps/web/src/main.tsx` to `apps/web/src/app/main.tsx`
- Move: `apps/web/src/styles.css` to `apps/web/src/app/styles.css`
- Move: `apps/web/src/components/` to `apps/web/src/shared/components/`
- Move: `apps/web/src/lib/` to `apps/web/src/shared/lib/`
- Move: `apps/web/src/hot150Catalog.ts` to `apps/web/src/catalog/hot150.ts`
- Replace: `apps/web/src/problemCatalog.ts`, `apps/web/src/problemRegistry.ts`, and `apps/web/src/types.ts`
- Create: `apps/web/src/catalog/roadmap.ts`, `apps/web/src/catalog/problems.ts`

**Interfaces:**
- `catalog/problems.ts` exports `problemCatalog`, `sortedProblems`, `allTags`, and `allCollections`.
- `problems/index.ts` exports `getVisualizerBySlug`.

- [ ] Update imports after the moves.
- [ ] Build the composed catalog from roadmap records and auto-discovered definitions.
- [ ] Update `App` to resolve a visualizer by slug instead of a central registry key.
- [ ] Run the complete Vitest suite and production build.

### Task 4: Update Tooling and Documentation

**Files:**
- Modify: `package.json`
- Modify: `vercel.json`
- Replace: `README.md`
- Replace: `docs/ARCHITECTURE.md`

- [ ] Forward root `dev`, `test`, and `build` commands to `apps/web`.
- [ ] Point Vercel install, build, and output settings to `apps/web`.
- [ ] Document the final folder structure, common commands, auto-discovery behavior, add-problem workflow, and deployment flow.
- [ ] Run `pnpm test`, `pnpm build`, and `git diff --check` from the relevant locations.

### Task 5: Commit and Release Check

**Files:**
- Verify all changed files only.

- [ ] Inspect the diff and confirm the untracked local `.gitignore` remains unmodified.
- [ ] Commit the refactor with a focused message.
- [ ] Verify the committed tree with the full test and build commands.

### Task 6: Add Missing Graph Traversal Visualizers

**Files:**
- Create: `apps/web/src/problems/0130-surrounded-regions/{definition,data,dryRun,Visualizer,dryRun.test}.ts[x]`
- Create: `apps/web/src/problems/0752-open-the-lock/{definition,data,dryRun,Visualizer,dryRun.test}.ts[x]`
- Modify: `apps/web/src/catalog/roadmap.ts`

**Interfaces:**
- Each module exports a `definition` satisfying `ReadyProblemDefinition`.
- Each dry-run generator returns frames with the active source-code line and the state needed by its visualizer.

- [ ] Write a focused test for a boundary-connected `O` and for an Open Lock BFS neighbor/level transition.
- [ ] Run the tests and observe import failures before their dry-run generators exist.
- [ ] Implement complete DFS and BFS frame generators plus visualizers using shared controls and `CodeTrace`.
- [ ] Confirm both focused tests, the complete suite, and the production build pass.
