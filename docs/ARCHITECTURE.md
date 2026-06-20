# AlgoTrace Architecture

AlgoTrace is organized for a large problem library. The catalog stays lightweight, while each finished visualizer lives in its own problem folder and is loaded only when the user opens that problem.

## Main Layers

```txt
outputs/trie-dfs-react-flow/src/
  App.tsx
  problemCatalog.ts
  problemRegistry.ts
  types.ts
  components/
  lib/
  problems/
```

## Files

`App.tsx`

Routes between the catalog, placeholder pages, and lazy-loaded visualizers.

`problemCatalog.ts`

Stores lightweight problem metadata: id, title, slug, difficulty, tags, pattern, summary, and whether a visualizer exists. This file can scale to hundreds of rows because it does not import heavy animation code.

`problemRegistry.ts`

Maps `visualizerKey` values to `React.lazy` imports. This keeps visualizer code split into separate chunks.

`components/`

Shared UI that many problems can reuse, such as:

```txt
CodeTrace.tsx
StepControls.tsx
TrieFlow.tsx
ProblemDirectory.tsx
ProblemPlaceholder.tsx
OperationTrieVisualizer.tsx
```

`lib/`

Shared logic without page UI:

```txt
hashRouting.ts
inputParsers.ts
trieModel.ts
trieOperationDryRun.ts
```

`problems/`

Each completed problem gets one folder:

```txt
problems/
  0017-letter-combinations-of-a-phone-number/
    data.ts
    dryRun.ts
    Visualizer.tsx
  0208-implement-trie-prefix-tree/
    data.ts
    Visualizer.tsx
  0211-design-add-and-search-words-data-structure/
    data.ts
    Visualizer.tsx
  0212-word-search-ii/
    data.ts
    dryRun.ts
    Visualizer.tsx
```

## Adding A New Problem

1. Add metadata in `problemCatalog.ts`.
2. Create `src/problems/XXXX-slug/`.
3. Put official examples and code lines in `data.ts`.
4. Put step generation logic in `dryRun.ts` when the problem has custom behavior.
5. Build the page in `Visualizer.tsx`, reusing shared components where possible.
6. Register the visualizer in `problemRegistry.ts`.
7. Run:

```bash
cd outputs/trie-dfs-react-flow
npm run build
```

## Scaling Notes

- The catalog should only import metadata, not all dry-run implementations.
- Heavy visualizers should stay behind `React.lazy`.
- Reusable visual patterns should become shared components instead of being copied into each problem.
- Large generated assets should not be committed to GitHub.
