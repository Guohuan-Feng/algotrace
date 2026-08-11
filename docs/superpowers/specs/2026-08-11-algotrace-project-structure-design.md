# AlgoTrace Project Structure Design

## Goal

Make AlgoTrace easy to grow from the current visualizer set to a library of roughly 500 problems. A ready problem must be self-contained, and adding it must not require edits to a global visualizer registry or a global key union.

## Constraints

- Preserve all current routes, visualizers, styles, catalog filters, and lazy loading behavior.
- Keep completed visualizers code-split. Loading the directory must not load every `Visualizer.tsx` module.
- Keep Hot 150 and other roadmap-only entries lightweight and separate from completed visualizer implementations.
- Retain the root Vercel deployment contract while placing the app in a conventional application directory.
- Use `pnpm` for local app commands.

## Target Layout

```txt
apps/
  web/
    index.html
    package.json
    pnpm-lock.yaml
    src/
      app/
        App.tsx
        main.tsx
        styles.css
      catalog/
        hot150.ts
        roadmap.ts
        problems.ts
        types.ts
      shared/
        components/
        lib/
      problems/
        index.ts
        0026-remove-duplicates-from-sorted-array/
          definition.ts
          data.ts
          dryRun.ts
          Visualizer.tsx
          dryRun.test.ts
docs/
  ARCHITECTURE.md
  superpowers/
    specs/
    plans/
README.md
```

## Problem Module Contract

Every completed problem keeps all algorithm-specific implementation files in its own numbered directory. It adds a small `definition.ts` that exports the catalog metadata required by the directory. The metadata deliberately contains no visualizer import.

`src/problems/index.ts` eagerly discovers only these small definitions with `import.meta.glob`. It creates one lazy visualizer loader per folder using a second, non-eager glob for `Visualizer.tsx`. This removes the hand-maintained `VisualizerKey` union and `problemRegistry.ts` while preserving Vite code splitting.

Completed problem visualizers use a default export. This makes the loader uniform and lets the catalog look up a visualizer by problem slug.

## Catalog Composition

`catalog/hot150.ts` contains Hot 150 roadmap data. `catalog/roadmap.ts` contains additional unsolved or planned entries. `catalog/problems.ts` merges those lightweight records with the auto-discovered completed problem definitions, then exports the existing sorted list, tags, and collections.

If an ID appears in both roadmap data and a completed problem definition, the completed definition wins. Therefore a problem turns from a roadmap row into a working visualizer by adding its folder, without needing to delete a copied metadata record elsewhere.

## New Visualizers In This Refactor

Two currently missing graph traversal visualizers join the new folder contract:

- `0130-surrounded-regions`: boundary-first DFS. Frames show the current cell, recursive boundary marking from `O` to temporary `T`, final enclosed-region flips, and final restoration of border-connected cells.
- `0752-open-the-lock`: level-order BFS. Frames show deadends, the queue, visited lock states, the current lock, each digit wheel neighbor, level boundaries, and the move count.

Both include official LeetCode examples, editable JSON input, code-line synchronization, and a focused dry-run regression test.

## Deployment and Documentation

The root remains the Vercel project root. `vercel.json` points its install, build, and output paths at `apps/web`. Root package scripts forward `dev`, `test`, and `build` to the application.

The rewritten README explains the product, the folder model, common commands, a concrete new-problem recipe, automated discovery, and Vercel deployment. `docs/ARCHITECTURE.md` documents the module boundaries in more depth.

## Validation

- A unit test verifies that the problem index discovers representative ready problem metadata and exposes a corresponding visualizer loader.
- Run the complete Vitest suite from `apps/web`.
- Run the production build from both `apps/web` and the root forwarding command.
- Run `git diff --check`.
