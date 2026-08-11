# AlgoTrace Architecture

AlgoTrace separates the lightweight problem directory from algorithm-specific visualizers. The browser can list hundreds of problems without downloading every animation implementation.

## Application Layers

```txt
apps/web/src/
  app/          Application entry point, hash-route shell, global CSS
  catalog/      Hot 150 data, additional roadmap entries, catalog composition
  shared/       Reusable components, domain types, parsing and Trie helpers
  problems/     Self-contained completed visualizer modules
```

## Problem Modules

Every ready problem lives in `src/problems/XXXX-slug/`.

- `definition.ts` exports `ReadyProblemDefinition`. It is intentionally small and contains no visualizer import.
- `data.ts` holds official examples and the Python code displayed in `CodeTrace`.
- `dryRun.ts` creates deterministic frames from an input. Each frame carries `activeLines` and the exact state the UI needs.
- `Visualizer.tsx` is the default export and connects input controls, the algorithm view, state panels, and `StepControls`.
- `dryRun.test.ts` protects important intermediate transitions plus the final answer.

`src/problems/index.ts` has two Vite globs:

1. Eagerly import `definition.ts` files so catalog filtering has only metadata.
2. Lazily import `Visualizer.tsx` files only after the user opens that problem route.

The loader pairs both paths from the same problem folder. This replaces the old central `problemRegistry.ts` and `VisualizerKey` union, so a completed problem is added in one place.

## Catalog Composition

`catalog/hot150.ts` and `catalog/roadmap.ts` hold problems without a visualizer. `catalog/problems.ts` merges them with discovered ready definitions. Records are keyed by LeetCode ID; a ready definition is appended last and replaces its roadmap entry.

This permits a problem to remain visible before its animation exists, then become ready simply by adding a module folder.

## Shared Layer

`shared/components/` owns UI reused across multiple problems, including `CodeTrace`, `StepControls`, Trie views, and the directory UI. `shared/lib/` contains non-visual helpers such as input parsing and the Trie model. `shared/types.ts` contains frame types shared by several visualizers.

Do not move problem-specific dry-run logic into `shared/` only because two algorithms both use BFS or DFS. Extract a shared abstraction only once it removes meaningful duplicated behavior.

## Verification

Run from the repository root:

```bash
pnpm test
pnpm build
git diff --check
```

The Vercel configuration deploys `apps/web/dist` while keeping the repository root as the Vercel project root.
