# Grid Traversal Visualizers Design

## Goal

Add three complete dry-run visualizers to AlgoTrace and deploy them to the existing Vercel site:

- 286. Walls and Gates
- 994. Rotting Oranges
- 417. Pacific Atlantic Water Flow

Each visualizer follows the existing three-column AlgoTrace workspace: official examples and JSON input on the left, a stateful grid in the center, and fixed playback controls, variables, and code trace on the right.

## Scope and Structure

Each problem receives its own folder under `src/problems/<id>-<slug>/` with:

- `data.ts`: the supplied Python code, line-numbered code trace, and original LeetCode examples.
- `dryRun.ts`: a deterministic, frame-by-frame simulation of the supplied algorithm.
- `Visualizer.tsx`: input handling, example switching, animation, state panel, and grid rendering.
- `dryRun.test.ts`: regression coverage for the algorithm result and one key state update.

The three visualizers are registered in `src/types.ts`, `src/problemRegistry.ts`, and `src/problemCatalog.ts`. Problem 417 and 994 are converted from catalog placeholders to ready visualizers; 286 is inserted as a new catalog problem.

## Visual Behavior

All three grids use deliberately distinct states: untouched cells are white, the currently executing cell is yellow, newly changed or completed cells are green, and invalid terrain is neutral gray. The right panel shows only variables that exist in the supplied code, and its Code Trace highlights the exact active Python lines.

### 286. Walls and Gates

Use the original LeetCode `INF = 2147483647` example. Gates begin as blue sources, walls are gray, an unfilled room is white, the dequeued cell is yellow, and an assigned room turns green with its distance. Every source enqueue, `popleft`, neighbor validation, room assignment, and neighbor enqueue becomes a frame. The right panel shows `queue`, `i`, `j`, `ni`, `nj`, and the current `rooms` matrix result.

### 994. Rotting Oranges

Use all three original LeetCode examples. The visualization separates a BFS level from a cell operation: it first announces the current `minutes` and `len(queue)`, then shows each dequeue and every newly rotten neighbor, and only then advances `minutes`. Fresh oranges remain white, empty cells gray, current rotten orange yellow, and newly rotten/completed oranges green. The right panel shows `queue`, `fresh`, `minutes`, the current level size, and current coordinates.

### 417. Pacific Atlantic Water Flow

Use the original five-by-five example and the one-cell example. The supplied recursive DFS is simulated in call order, including source calls that immediately return when already visited. The center grid makes reachability readable: Pacific-only is blue, Atlantic-only is coral, both oceans is green, current DFS cell is yellow, and untouched cells remain white. The right panel shows the active ocean traversal, `i`, `j`, `ni`, `nj`, recursion stack, and answer cells. The final collection pass visibly adds only cells reachable from both oceans.

## Inputs and Guardrails

All pages preserve the existing example switcher and accept a custom rectangular JSON matrix. Matrix size is capped at 5 x 5 to keep frame counts usable. Walls and Gates accepts integer rooms with `2147483647` for `INF`; Rotting Oranges accepts only 0, 1, and 2; Pacific Atlantic accepts integer heights.

## Tests and Verification

Tests must be written before each dry-run implementation and prove:

- Walls and Gates writes the official final distance matrix.
- Rotting Oranges returns 4 minutes for example 1 and `-1` for the unreachable fresh-orange case.
- Pacific Atlantic returns the official intersection cells and visibly records a both-oceans cell.

Before deployment, run the full test suite, the production build, a local browser check of one key frame for each page, and `git diff --check`. Commit the feature and publish it to `algotrace-dryrun.vercel.app`.
